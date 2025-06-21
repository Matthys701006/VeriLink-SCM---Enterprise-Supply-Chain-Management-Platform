import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Clock, 
  Calendar, 
  Award, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Shield,
  Search,
  Filter
} from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  position: string;
  manager_id?: string;
  hire_date: string;
  employment_status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  salary_band: string;
  performance_rating?: number;
  certifications: string[];
  training_completed: number;
  training_required: number;
  last_review_date?: string;
  next_review_date?: string;
  created_at: string;
}

interface Shift {
  id: string;
  employee_id: string;
  shift_date: string;
  clock_in?: string;
  clock_out?: string;
  break_duration?: number;
  hours_worked?: number;
  overtime_hours?: number;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
}

export const HR: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'employees' | 'timesheets' | 'training' | 'compliance'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    if (organization?.id) {
      loadHRData();
    }
  }, [organization?.id]);

  const loadHRData = async () => {
    try {
      setLoading(true);
      
      // Since we don't have HR tables yet, generate mock data
      const mockEmployees = generateMockEmployees();
      const mockShifts = generateMockShifts(mockEmployees);
      
      setEmployees(mockEmployees);
      setShifts(mockShifts);

    } catch (error) {
      console.error('Error loading HR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockEmployees = (): Employee[] => {
    const departments = ['Warehouse Operations', 'Procurement', 'Logistics', 'Quality Control', 'Administration'];
    const positions = ['Warehouse Supervisor', 'Forklift Operator', 'Procurement Specialist', 'Quality Inspector', 'Logistics Coordinator'];
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const certifications = ['Forklift License', 'Safety Training', 'Hazmat Certification', 'First Aid', 'Quality Management'];

    return Array.from({ length: 45 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      return {
        id: `emp-${i + 1}`,
        employee_id: `EMP-${String(i + 1).padStart(4, '0')}`,
        full_name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department,
        position,
        hire_date: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        employment_status: ['active', 'active', 'active', 'active', 'on_leave', 'inactive'][Math.floor(Math.random() * 6)] as Employee['employment_status'],
        salary_band: ['L1', 'L2', 'L3', 'L4', 'L5'][Math.floor(Math.random() * 5)],
        performance_rating: 3 + Math.random() * 2, // 3-5 rating
        certifications: certifications.slice(0, Math.floor(Math.random() * 3) + 1),
        training_completed: Math.floor(Math.random() * 10) + 5,
        training_required: Math.floor(Math.random() * 5) + 10,
        last_review_date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        next_review_date: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  };

  const generateMockShifts = (employees: Employee[]): Shift[] => {
    const shifts: Shift[] = [];
    const locations = ['Warehouse A', 'Warehouse B', 'Loading Dock', 'Quality Lab', 'Office'];
    
    employees.forEach(employee => {
      // Generate shifts for last 7 days
      for (let i = 0; i < 7; i++) {
        const shiftDate = new Date();
        shiftDate.setDate(shiftDate.getDate() - i);
        
        if (Math.random() > 0.1) { // 90% chance of having a shift
          const clockIn = new Date(shiftDate);
          clockIn.setHours(8 + Math.floor(Math.random() * 2)); // 8-9 AM start
          clockIn.setMinutes(Math.floor(Math.random() * 60));
          
          const clockOut = new Date(clockIn);
          clockOut.setHours(clockIn.getHours() + 8 + Math.floor(Math.random() * 2)); // 8-9 hour shift
          
          const hoursWorked = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
          const overtimeHours = Math.max(0, hoursWorked - 8);
          
          shifts.push({
            id: `shift-${employee.id}-${i}`,
            employee_id: employee.id,
            shift_date: shiftDate.toISOString().split('T')[0],
            clock_in: clockIn.toISOString(),
            clock_out: clockOut.toISOString(),
            break_duration: 30 + Math.floor(Math.random() * 30), // 30-60 minutes
            hours_worked: Math.round(hoursWorked * 100) / 100,
            overtime_hours: Math.round(overtimeHours * 100) / 100,
            location: locations[Math.floor(Math.random() * locations.length)],
            status: 'completed'
          });
        }
      }
    });
    
    return shifts;
  };

  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];

  // Calculate metrics
  const activeEmployees = employees.filter(emp => emp.employment_status === 'active').length;
  const avgPerformance = employees.reduce((sum, emp) => sum + (emp.performance_rating || 0), 0) / employees.length;
  const totalHoursThisWeek = shifts.reduce((sum, shift) => sum + (shift.hours_worked || 0), 0);
  const complianceRate = employees.filter(emp => emp.training_completed >= emp.training_required).length / employees.length * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('hr.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access HR data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
          <p className="text-gray-600">Manage employees, timesheets, training, and compliance</p>
        </div>
        {hasPermission('hr.write') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{activeEmployees}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 text-sm text-green-600">+3 new hires this month</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">{avgPerformance.toFixed(1)}/5.0</p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 text-sm text-green-600">+0.2 vs last quarter</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hours This Week</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalHoursThisWeek).toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-2 text-sm text-gray-500">Across all employees</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{complianceRate.toFixed(0)}%</p>
            </div>
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-2 text-sm text-orange-600">12 employees need training</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('employees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employees ({employees.length})
            </button>
            <button
              onClick={() => setSelectedTab('timesheets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'timesheets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timesheets
            </button>
            <button
              onClick={() => setSelectedTab('training')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'training'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Training & Development
            </button>
            <button
              onClick={() => setSelectedTab('compliance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'compliance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compliance
            </button>
          </nav>
        </div>

        {selectedTab === 'employees' ? (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>

            {/* Employees Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Training Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Review
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => {
                    const trainingProgress = (employee.training_completed / employee.training_required) * 100;
                    return (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                            <div className="text-sm text-gray-500">{employee.employee_id} • {employee.position}</div>
                            <div className="text-xs text-gray-400">{employee.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.department}</div>
                          <div className="text-sm text-gray-500">Salary Band: {employee.salary_band}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEmploymentStatusColor(employee.employment_status)}`}>
                            {employee.employment_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {employee.performance_rating && (
                            <div className={`text-sm font-medium ${getPerformanceColor(employee.performance_rating)}`}>
                              {employee.performance_rating.toFixed(1)}/5.0
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{employee.training_completed}/{employee.training_required}</span>
                                <span>{trainingProgress.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    trainingProgress >= 100 ? 'bg-green-500' : 
                                    trainingProgress >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(trainingProgress, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.next_review_date 
                            ? new Date(employee.next_review_date).toLocaleDateString()
                            : 'Not scheduled'
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedTab === 'timesheets' ? (
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Biometric Time Tracking Integration</h3>
                  <p className="text-blue-700 mt-1">
                    Seamless integration with biometric time clocks ensuring accurate attendance and compliance with labor regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Timesheet management system</p>
              <p className="text-sm text-gray-400 mt-1">Real-time attendance tracking with biometric verification</p>
            </div>
          </div>
        ) : selectedTab === 'training' ? (
          <div className="p-6">
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Training & Development Portal</p>
              <p className="text-sm text-gray-400 mt-1">Manage employee certifications, skills development, and compliance training</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Compliance Management</p>
              <p className="text-sm text-gray-400 mt-1">Monitor regulatory compliance, certifications, and audit requirements</p>
            </div>
          </div>
        )}
      </div>

      {filteredEmployees.length === 0 && selectedTab === 'employees' && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No employees found matching your criteria</p>
        </div>
      )}
    </div>
  );
};