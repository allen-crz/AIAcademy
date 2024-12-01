// Path: /src/types/index.ts
export interface Course {
    id: string
    title: string
    description: string
    imageUrl: string
    lessons: {
      id: string
      title: string
    }[]
    progress: {
      id: string
      completed: boolean
    }[]
    badges: {
      id: string
      name: string
      type: "achievement" | "progress" | "completion"
    }[]
  }