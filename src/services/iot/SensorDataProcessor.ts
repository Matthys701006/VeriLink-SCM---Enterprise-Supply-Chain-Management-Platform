import { supabase } from '../supabase/client';
import { externalAPI } from '../api/ExternalAPIService';

interface SensorReading {
  id: string;
  sensor_id: string;
  reading_timestamp: string;
  reading_value: number;
  reading_unit: string;
  reading_quality: 'good' | 'poor' | 'error';
  additional_data: Record<string, any>;
  alert_triggered: boolean;
  alert_level?: 'low' | 'medium' | 'high' | 'critical';
  processed: boolean;
  anomaly_score?: number;
}

interface IoTSensor {
  id: string;
  sensor_id: string;
  sensor_type: 'temperature' | 'humidity' | 'pressure' | 'gps' | 'vibration' | 'light' | 'proximity';
  warehouse_id?: string;
  vehicle_id?: string;
  location_description?: string;
  alert_thresholds: Record<string, any>;
  sampling_rate: number;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  is_active: boolean;
}

interface Alert {
  id: string;
  sensor_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  triggered_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  metadata: Record<string, any>;
}

class SensorDataProcessor {
  private static instance: SensorDataProcessor;
  private processingInterval?: NodeJS.Timeout;
  private alertCallbacks: Array<(alert: Alert) => void> = [];

  private constructor() {
    this.startProcessing();
  }

  static getInstance(): SensorDataProcessor {
    if (!SensorDataProcessor.instance) {
      SensorDataProcessor.instance = new SensorDataProcessor();
    }
    return SensorDataProcessor.instance;
  }

  // Start real-time processing
  startProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    // Process sensor data every 30 seconds
    this.processingInterval = setInterval(async () => {
      await this.processAllSensors();
    }, 30000);

    console.log('IoT sensor data processing started');
  }

  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = undefined;
    }
    console.log('IoT sensor data processing stopped');
  }

  // Process all active sensors
  private async processAllSensors(): Promise<void> {
    try {
      const { data: sensors, error } = await supabase
        .from('iot_sensors')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'active');

      if (error) throw error;

      for (const sensor of sensors || []) {
        await this.processSensorData(sensor);
      }
    } catch (error) {
      console.error('Error processing sensors:', error);
    }
  }

  // Process individual sensor data
  private async processSensorData(sensor: IoTSensor): Promise<void> {
    try {
      // Get latest sensor data from IoT platform
      const sensorData = await externalAPI.getIoTSensorData(sensor.sensor_id);
      
      if (sensorData.status === 'offline' || sensorData.status === 'error') {
        await this.handleSensorOffline(sensor);
        return;
      }

      // Process each reading
      for (const reading of sensorData.readings) {
        await this.processReading(sensor, reading);
      }

      // Update sensor status
      await supabase
        .from('iot_sensors')
        .update({
          status: sensorData.status,
          battery_level: sensorData.battery_level,
          updated_at: new Date().toISOString()
        })
        .eq('sensor_id', sensor.sensor_id);

    } catch (error) {
      console.error(`Error processing sensor ${sensor.sensor_id}:`, error);
    }
  }

  // Process individual reading
  private async processReading(sensor: IoTSensor, reading: any): Promise<void> {
    try {
      // Check if reading already exists
      const { data: existingReading } = await supabase
        .from('sensor_readings')
        .select('id')
        .eq('sensor_id', sensor.sensor_id)
        .eq('reading_timestamp', reading.timestamp)
        .single();

      if (existingReading) {
        return; // Skip if already processed
      }

      // Calculate anomaly score
      const anomalyScore = await this.calculateAnomalyScore(sensor, reading.value);

      // Check for alerts
      const alertInfo = this.checkAlertThresholds(sensor, reading.value);

      // Store reading
      const { data: newReading, error } = await supabase
        .from('sensor_readings')
        .insert({
          sensor_id: sensor.sensor_id,
          reading_timestamp: reading.timestamp,
          reading_value: reading.value,
          reading_unit: reading.unit,
          reading_quality: reading.quality,
          additional_data: {},
          alert_triggered: alertInfo.triggered,
          alert_level: alertInfo.level,
          processed: false,
          anomaly_score: anomalyScore
        })
        .select()
        .single();

      if (error) throw error;

      // Generate alert if threshold exceeded
      if (alertInfo.triggered) {
        await this.generateAlert(sensor, newReading, alertInfo);
      }

      // Update warehouse/vehicle data if applicable
      await this.updateAssetData(sensor, reading);

    } catch (error) {
      console.error('Error processing reading:', error);
    }
  }

  // Calculate anomaly score using simple statistical method
  private async calculateAnomalyScore(sensor: IoTSensor, currentValue: number): Promise<number> {
    try {
      // Get historical data for comparison
      const { data: historicalData } = await supabase
        .from('sensor_readings')
        .select('reading_value')
        .eq('sensor_id', sensor.sensor_id)
        .gte('reading_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('reading_timestamp', { ascending: false })
        .limit(100);

      if (!historicalData || historicalData.length < 10) {
        return 0; // Not enough data for anomaly detection
      }

      const values = historicalData.map(d => d.reading_value);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      // Calculate z-score
      const zScore = Math.abs((currentValue - mean) / stdDev);
      
      // Convert to 0-1 anomaly score
      return Math.min(zScore / 3, 1); // Values beyond 3 standard deviations are considered highly anomalous

    } catch (error) {
      console.error('Error calculating anomaly score:', error);
      return 0;
    }
  }

  // Check if reading exceeds alert thresholds
  private checkAlertThresholds(sensor: IoTSensor, value: number): { triggered: boolean; level?: string; message?: string } {
    const thresholds = sensor.alert_thresholds;
    
    if (!thresholds) {
      return { triggered: false };
    }

    // Check critical thresholds first
    if (thresholds.critical_max !== undefined && value > thresholds.critical_max) {
      return {
        triggered: true,
        level: 'critical',
        message: `${sensor.sensor_type} reading (${value}) exceeds critical maximum (${thresholds.critical_max})`
      };
    }

    if (thresholds.critical_min !== undefined && value < thresholds.critical_min) {
      return {
        triggered: true,
        level: 'critical',
        message: `${sensor.sensor_type} reading (${value}) below critical minimum (${thresholds.critical_min})`
      };
    }

    // Check high thresholds
    if (thresholds.high_max !== undefined && value > thresholds.high_max) {
      return {
        triggered: true,
        level: 'high',
        message: `${sensor.sensor_type} reading (${value}) exceeds high threshold (${thresholds.high_max})`
      };
    }

    if (thresholds.high_min !== undefined && value < thresholds.high_min) {
      return {
        triggered: true,
        level: 'high',
        message: `${sensor.sensor_type} reading (${value}) below high threshold (${thresholds.high_min})`
      };
    }

    // Check medium thresholds
    if (thresholds.medium_max !== undefined && value > thresholds.medium_max) {
      return {
        triggered: true,
        level: 'medium',
        message: `${sensor.sensor_type} reading (${value}) exceeds medium threshold (${thresholds.medium_max})`
      };
    }

    if (thresholds.medium_min !== undefined && value < thresholds.medium_min) {
      return {
        triggered: true,
        level: 'medium',
        message: `${sensor.sensor_type} reading (${value}) below medium threshold (${thresholds.medium_min})`
      };
    }

    return { triggered: false };
  }

  // Generate alert
  private async generateAlert(sensor: IoTSensor, reading: SensorReading, alertInfo: any): Promise<void> {
    try {
      const alert: Omit<Alert, 'id'> = {
        sensor_id: sensor.sensor_id,
        alert_type: `${sensor.sensor_type}_threshold`,
        severity: alertInfo.level,
        message: alertInfo.message,
        triggered_at: reading.reading_timestamp,
        metadata: {
          sensor_type: sensor.sensor_type,
          reading_value: reading.reading_value,
          reading_unit: reading.reading_unit,
          warehouse_id: sensor.warehouse_id,
          vehicle_id: sensor.vehicle_id,
          location: sensor.location_description,
          anomaly_score: reading.anomaly_score
        }
      };

      // Store alert in database (would need alerts table)
      console.log('Alert generated:', alert);

      // Trigger callbacks for real-time notifications
      this.alertCallbacks.forEach(callback => {
        try {
          callback(alert as Alert);
        } catch (error) {
          console.error('Error in alert callback:', error);
        }
      });

      // Create notification for users
      await this.createUserNotification(sensor, alert);

    } catch (error) {
      console.error('Error generating alert:', error);
    }
  }

  // Create user notification
  private async createUserNotification(sensor: IoTSensor, alert: Omit<Alert, 'id'>): Promise<void> {
    try {
      // Get users who should be notified based on sensor location
      let recipientQuery = supabase
        .from('users')
        .select('id')
        .eq('is_active', true);

      if (sensor.warehouse_id) {
        // Notify warehouse supervisors
        recipientQuery = recipientQuery.eq('role', 'warehouse_supervisor');
      } else if (sensor.vehicle_id) {
        // Notify logistics coordinators
        recipientQuery = recipientQuery.eq('role', 'logistics_coordinator');
      }

      const { data: recipients } = await recipientQuery;

      for (const recipient of recipients || []) {
        await supabase
          .from('notifications')
          .insert({
            recipient_id: recipient.id,
            type: 'sensor_alert',
            priority: alert.severity === 'critical' ? 'urgent' : 
                     alert.severity === 'high' ? 'high' : 'normal',
            title: `Sensor Alert: ${sensor.sensor_type}`,
            message: alert.message,
            action_url: sensor.warehouse_id ? `/warehouses` : `/logistics`,
            is_read: false,
            metadata: alert.metadata
          });
      }

    } catch (error) {
      console.error('Error creating user notification:', error);
    }
  }

  // Handle sensor offline
  private async handleSensorOffline(sensor: IoTSensor): Promise<void> {
    try {
      await supabase
        .from('iot_sensors')
        .update({
          status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('sensor_id', sensor.sensor_id);

      // Generate offline alert
      const alert = {
        sensor_id: sensor.sensor_id,
        alert_type: 'sensor_offline',
        severity: 'high' as const,
        message: `Sensor ${sensor.sensor_id} is offline`,
        triggered_at: new Date().toISOString(),
        metadata: {
          sensor_type: sensor.sensor_type,
          last_seen: new Date().toISOString(),
          location: sensor.location_description
        }
      };

      await this.createUserNotification(sensor, alert);

    } catch (error) {
      console.error('Error handling offline sensor:', error);
    }
  }

  // Update warehouse/vehicle data based on sensor readings
  private async updateAssetData(sensor: IoTSensor, reading: any): Promise<void> {
    try {
      if (sensor.warehouse_id && sensor.sensor_type === 'temperature') {
        // Update warehouse environmental conditions
        await supabase
          .from('warehouses')
          .update({
            metadata: {
              current_temperature: reading.value,
              last_temp_update: reading.timestamp
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', sensor.warehouse_id);
      }

      if (sensor.vehicle_id && sensor.sensor_type === 'gps') {
        // Update vehicle location
        await supabase
          .from('vehicles')
          .update({
            current_location: {
              lat: reading.additional_data?.latitude,
              lng: reading.additional_data?.longitude,
              timestamp: reading.timestamp
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', sensor.vehicle_id);
      }

    } catch (error) {
      console.error('Error updating asset data:', error);
    }
  }

  // Register alert callback
  onAlert(callback: (alert: Alert) => void): void {
    this.alertCallbacks.push(callback);
  }

  // Remove alert callback
  removeAlertCallback(callback: (alert: Alert) => void): void {
    const index = this.alertCallbacks.indexOf(callback);
    if (index > -1) {
      this.alertCallbacks.splice(index, 1);
    }
  }

  // Get sensor statistics
  async getSensorStatistics(sensorId: string, timeRange: '1h' | '24h' | '7d' | '30d'): Promise<{
    average: number;
    minimum: number;
    maximum: number;
    readings_count: number;
    anomaly_count: number;
    alert_count: number;
  }> {
    try {
      const timeRangeHours = {
        '1h': 1,
        '24h': 24,
        '7d': 168,
        '30d': 720
      };

      const since = new Date(Date.now() - timeRangeHours[timeRange] * 60 * 60 * 1000).toISOString();

      const { data: readings } = await supabase
        .from('sensor_readings')
        .select('reading_value, anomaly_score, alert_triggered')
        .eq('sensor_id', sensorId)
        .gte('reading_timestamp', since)
        .order('reading_timestamp', { ascending: false });

      if (!readings || readings.length === 0) {
        return {
          average: 0,
          minimum: 0,
          maximum: 0,
          readings_count: 0,
          anomaly_count: 0,
          alert_count: 0
        };
      }

      const values = readings.map(r => r.reading_value);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const minimum = Math.min(...values);
      const maximum = Math.max(...values);
      const anomaly_count = readings.filter(r => r.anomaly_score && r.anomaly_score > 0.7).length;
      const alert_count = readings.filter(r => r.alert_triggered).length;

      return {
        average: Math.round(average * 100) / 100,
        minimum,
        maximum,
        readings_count: readings.length,
        anomaly_count,
        alert_count
      };

    } catch (error) {
      console.error('Error getting sensor statistics:', error);
      return {
        average: 0,
        minimum: 0,
        maximum: 0,
        readings_count: 0,
        anomaly_count: 0,
        alert_count: 0
      };
    }
  }
}

export const sensorProcessor = SensorDataProcessor.getInstance();
export default SensorDataProcessor;