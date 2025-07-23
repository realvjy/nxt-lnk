// Common type definitions used across the application

/**
 * Generic response status
 */
export type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Color theme options
 */
export type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'custom'

/**
 * Layout options
 */
export type LayoutStyle = 'standard' | 'compact' | 'grid' | 'minimal'

/**
 * Common metadata interface
 */
export interface Metadata {
    createdAt?: string
    updatedAt?: string
    version?: number
}

/**
 * SEO related metadata
 */
export interface SEOData {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
}

/**
 * User preferences
 */
export interface UserPreferences {
    theme: ThemeMode
    colorTheme: ColorTheme
    layout: LayoutStyle
    showBadge: boolean
    showSocialIcons: boolean
    customDomain?: string
    seo?: SEOData
}

/**
 * Generic API response
 */
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    status?: number
}