import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Task, TaskService } from '../../services/task.service';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { isPlatformBrowser } from '@angular/common';

Chart.register(...registerables);


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

  tasks: Task[] = [];
  totalTasks = 0;
  tasksDueToday = 0;
  tasksDueThisWeek = 0;
  overdueTasks = 0;
  isBrowser: boolean;

  // Define custom labels
  statusLabels = ['To Do', 'In Progress', 'Done'];
  priorityLabels = ['High', 'Medium', 'Low'];

  // Define a mapping between internal status and custom labels
  statusLabelMap = {
    'todo': 'To Do',
    'doing': 'In Progress',
    'done': 'Done'
  };
  priorityLabelMap = {
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low'
  };


  statusDistribution!: ChartData<'pie'>;
  statusDistributionOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`
        }
      }
    }
  };

  priorityDistribution!: ChartData<'bar'>;
  priorityDistributionOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Priority'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks'
        }
      }
    },
    layout: {
      padding: 10
    }
  };

  constructor(private taskService: TaskService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.calculateStatistics();
      this.updateCharts();
    });
  }

  private calculateStatistics() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // start of week

    this.totalTasks = this.tasks.length;
    this.tasksDueToday = this.tasks.filter(task => this.isDueToday(task.dueDate)).length;
    this.tasksDueThisWeek = this.tasks.filter(task => new Date(task.dueDate) >= startOfWeek).length;
    this.overdueTasks = this.tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'done').length;
  }

  private isDueToday(dueDate: string): boolean {
    return new Date(dueDate).toDateString() === new Date().toDateString();
  }

  private updateCharts() {
    // Prepare data for status distribution
    const statusCounts = this.tasks.reduce((acc, task) => {
      const label = this.statusLabelMap[task.status] || task.status;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.statusDistribution = {
      labels: this.statusLabels,
      datasets: [{
        data: this.statusLabels.map(label => statusCounts[label] || 0),
        backgroundColor: ['#F87171', '#38BDF8', '#34D399']
      }]
    };

    // Prepare data for priority distribution
    const priorityCounts = this.tasks.reduce((acc, task) => {
      const label = this.priorityLabelMap[task.priority] || task.priority;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.priorityDistribution = {
      labels: this.priorityLabels,
      datasets: [{
        data: this.priorityLabels.map(label => priorityCounts[label] || 0),
        backgroundColor: ['#2DD4BF', '#FB923C', '#F472B6']
      }]
    };
  }
}
