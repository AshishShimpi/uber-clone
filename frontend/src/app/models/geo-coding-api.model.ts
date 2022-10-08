export interface GeoCoding {
    type: string
    features: Feature[]
    query: string[]
    attribution: string
  }
  
  export interface Feature {
    type: string
    id: string
    properties: object
    geometry: object
    bbox: number[]
    center: number[]
    place_name: string
    place_type: string[]
    relevance: number
    text: string
    context?: object[]
  }
  