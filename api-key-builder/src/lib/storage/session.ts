import { User } from '@/lib/store/api/authSlice'

export const STORAGE_KEYS = {
  TOKEN: 'TOKEN',
  USER: 'USER',
} as const

type StorageKey = keyof typeof STORAGE_KEYS

class SessionStorage {
  private static instance: SessionStorage
  private isClient: boolean

  private constructor() {
    this.isClient = typeof window !== 'undefined'
  }

  public static getInstance(): SessionStorage {
    if (!SessionStorage.instance) {
      SessionStorage.instance = new SessionStorage()
    }
    return SessionStorage.instance
  }

  private getStoredItem<T>(key: StorageKey): T | null {
    if (!this.isClient) return null
    const item: string | null = window.sessionStorage.getItem(STORAGE_KEYS[key])
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch {
      return item as unknown as T
    }
  }

  private setItem<T>(key: StorageKey, value: T): void {
    if (!this.isClient) return
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    window.sessionStorage.setItem(STORAGE_KEYS[key], serialized)
  }

  private removeItem(key: StorageKey): void {
    if (!this.isClient) return
    window.sessionStorage.removeItem(STORAGE_KEYS[key])
  }

  public getToken(): string | null {
    return this.getStoredItem<string>(STORAGE_KEYS.TOKEN)
  }

  public getUser(): User | null {
    return this.getStoredItem<User>(STORAGE_KEYS.USER)
  }

  public setToken(token: string): void {
    this.setItem(STORAGE_KEYS.TOKEN, token)
  }

  public setUser(user: User): void {
    this.setItem(STORAGE_KEYS.USER, user)
  }

  public clear(): void {
    this.removeItem(STORAGE_KEYS.TOKEN)
    this.removeItem(STORAGE_KEYS.USER)
  }
}

export const sessionStorage = SessionStorage.getInstance() 