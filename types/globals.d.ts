export {}

export type Roles = 'admin' | 'seller'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}