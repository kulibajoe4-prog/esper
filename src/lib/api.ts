/**
 * API Client pour iPresence UCB
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost/ipresence/api';

export interface Student {
  id?: number;
  matricule: string;
  fullname: string;
  birthday: string;
  birthplace: string;
  city: string;
  civilStatus: string;
  avatar: string;
  active: number;
  promotionId: number;
  promotion_title?: string;
  promotion_label?: string;
  entity_title?: string;
}

export interface Promotion {
  id: number;
  title: string;
  label: string;
  level: number;
  entityId: number;
  entity_title?: string;
  entity_label?: string;
}

export interface Entity {
  id: number;
  title: string;
  label: string;
  level: number;
  parent_id?: number;
}

export interface Presence {
  id: number;
  matricule: string;
  date: string;
  time: string;
  status: 'on_time' | 'late' | 'absent';
  course_id?: number;
  fullname?: string;
  course_title?: string;
  course_code?: string;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  code: string;
  start_time: string;
  end_time: string;
  promotionId: number;
  professor?: string;
  room?: string;
  day_of_week: string;
  active: number;
  promotion_title?: string;
  promotion_label?: string;
}

export interface Stats {
  global: {
    total_presences: number;
    on_time_count: number;
    late_count: number;
    unique_students: number;
    days_with_presences: number;
  };
  by_promotion: Array<{
    promotion: string;
    total_presences: number;
    on_time_count: number;
    late_count: number;
    unique_students: number;
  }>;
  daily: Array<{
    date: string;
    total_presences: number;
    on_time_count: number;
    late_count: number;
  }>;
  period: {
    start_date: string;
    end_date: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: number;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api.php${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Récupérer un étudiant par matricule
  async getStudent(matricule: string): Promise<Student> {
    return this.request<Student>(`?action=getStudent&matricule=${encodeURIComponent(matricule)}`);
  }

  // Récupérer la structure académique
  async getStructure(): Promise<{ promotions: Promotion[]; entities: Entity[] }> {
    return this.request<{ promotions: Promotion[]; entities: Entity[] }>('?action=getStructure');
  }

  // Marquer la présence d'un étudiant
  async markPresence(data: {
    matricule: string;
    date?: string;
    time?: string;
    course_id?: number;
  }): Promise<{ message: string; matricule: string; date: string; time: string; status: string }> {
    return this.request<{ message: string; matricule: string; date: string; time: string; status: string }>(
      '?action=markPresence',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // Récupérer les présences
  async getPresences(params: {
    matricule?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Presence[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<Presence[]>(`?action=getPresences&${queryParams.toString()}`);
  }

  // Récupérer les statistiques
  async getStats(startDate?: string, endDate?: string): Promise<Stats> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    return this.request<Stats>(`?action=getStats&${params.toString()}`);
  }

  // Récupérer la liste des étudiants
  async getStudents(params: {
    promotion_id?: number;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Student[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<Student[]>(`?action=getStudents&${queryParams.toString()}`);
  }

  // Récupérer les cours
  async getCourses(params: {
    promotion_id?: number;
    day_of_week?: string;
  } = {}): Promise<Course[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<Course[]>(`?action=getCourses&${queryParams.toString()}`);
  }
}

export const apiClient = new ApiClient();