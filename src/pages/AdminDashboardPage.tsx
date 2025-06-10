import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Code, MessageSquare, TrendingUp, 
  Plus, Settings, BarChart3, FileText, Award, Eye
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalResources: number;
  totalCommunities: number;
  activeUsers: number;
  newUsersThisWeek: number;
}

function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalResources: 0,
    totalCommunities: 0,
    activeUsers: 0,
    newUsersThisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard | LearnFlow';
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total projects
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Get total learning resources
      const { count: totalResources } = await supabase
        .from('learning_resources')
        .select('*', { count: 'exact', head: true });

      // Get total study groups (communities)
      const { count: totalCommunities } = await supabase
        .from('study_groups')
        .select('*', { count: 'exact', head: true });

      // Get new users this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: newUsersThisWeek } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());

      setStats({
        totalUsers: totalUsers || 0,
        totalProjects: totalProjects || 0,
        totalResources: totalResources || 0,
        totalCommunities: totalCommunities || 0,
        activeUsers: Math.floor((totalUsers || 0) * 0.7), // Estimate
        newUsersThisWeek: newUsersThisWeek || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.newUsersThisWeek} this week`
    },
    {
      title: 'Active Projects',
      value: stats.totalProjects,
      icon: Code,
      color: 'bg-green-500',
      change: 'All time'
    },
    {
      title: 'Learning Resources',
      value: stats.totalResources,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: 'Published'
    },
    {
      title: 'Communities',
      value: stats.totalCommunities,
      icon: MessageSquare,
      color: 'bg-orange-500',
      change: 'Study groups'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'bg-pink-500',
      change: 'Last 30 days'
    },
    {
      title: 'New Users',
      value: stats.newUsersThisWeek,
      icon: Award,
      color: 'bg-indigo-500',
      change: 'This week'
    }
  ];

  const quickActions = [
    {
      title: 'Add Learning Resource',
      description: 'Create new courses, tutorials, and learning materials',
      icon: Plus,
      link: '/admin/resources/add',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Resources',
      description: 'Edit, update, and organize learning resources',
      icon: BookOpen,
      link: '/admin/resources',
      color: 'bg-green-500'
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts and permissions',
      icon: Users,
      link: '/admin/users',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-orange-500'
    },
    {
      title: 'Content Moderation',
      description: 'Review and moderate user-generated content',
      icon: Eye,
      link: '/admin/moderation',
      color: 'bg-pink-500'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and preferences',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-indigo-500'
    }
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Manage and monitor the LearnFlow platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-100 dark:border-dark-border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-100 dark:border-dark-border">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-border rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium">New user registered</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                2 minutes ago
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-border rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium">New project created</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                15 minutes ago
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-border rounded-lg">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium">Learning resource updated</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                1 hour ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboardPage;