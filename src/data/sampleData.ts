export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = JsonValue[]

export const sampleData: { [key: string]: JsonValue } = {
  users: [
    {
      id: 1,
      name: "Alice Kim",
      email: "alice@example.com",
      active: true,
      score: 9420,
      address: {
        city: "Seoul",
        district: "Gangnam-gu",
        zip: "06000",
        geo: { lat: 37.4979, lng: 127.0276 },
      },
      tags: ["admin", "verified", "premium"],
      preferences: {
        theme: "dark",
        language: "ko",
        notifications: { email: true, sms: false, push: true },
      },
    },
    {
      id: 2,
      name: "Bob Lee",
      email: "bob@example.com",
      active: false,
      score: 3800,
      address: {
        city: "Busan",
        district: "Haeundae-gu",
        zip: "48094",
        geo: { lat: 35.1631, lng: 129.1636 },
      },
      tags: ["user"],
      preferences: {
        theme: "light",
        language: "en",
        notifications: { email: false, sms: false, push: false },
      },
    },
  ],
  products: { test1: {
      id: 1,
      name: "Alice Kim",
      email: "alice@example.com",
      active: true,
      score: 9420,
      address: {
        city: "Seoul",
        district: "Gangnam-gu",
        zip: "06000",
        geo: { lat: 37.4979, lng: 127.0276, test2: {
      id: 1,
      name: "Alice Kim",
      email: "alice@example.com",
      active: true,
      score: 9420,
      address: {
        city: "Seoul",
        district: "Gangnam-gu",
        zip: "06000",
        geo: { lat: 37.4979, lng: 127.0276 },
      },
      tags: ["admin", "verified", "premium"],
      preferences: {
        theme: "dark",
        language: "ko",
        notifications: { email: true, sms: false, push: true },
      },
    }, },
      },
      tags: ["admin", "verified", "premium"],
      preferences: {
        theme: "dark",
        language: "ko",
        notifications: { email: true, sms: false, push: true },
      },
    },
    electronics: [
      { sku: "EL-001", name: "Noise Cancelling Headphones", price: 299.99, inStock: true, rating: 4.7 },
      { sku: "EL-002", name: "Mechanical Keyboard", price: 149.0, inStock: true, rating: 4.5 },
      { sku: "EL-003", name: "4K Monitor", price: 599.0, inStock: false, rating: 4.8 },
    ],
    clothing: [
      { sku: "CL-001", name: "Merino Wool Sweater", price: 89.0, inStock: true, rating: 4.3 },
    ],
  },
  config: {
    version: "2.1.0",
    environment: "production",
    features: { darkMode: true, betaSearch: false, analytics: true },
    limits: { maxRequests: 1000, timeoutMs: 5000, retries: 3 },
  },
  stats: {
    totalUsers: 12489,
    activeToday: 847,
    revenue: { q1: 48200, q2: 61700, q3: 57900, q4: 72300 },
  },
}