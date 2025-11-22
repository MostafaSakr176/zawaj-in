declare module "react-simple-maps" {
  import { ReactNode, CSSProperties } from "react"

  export interface ProjectionConfig {
    scale?: number
    center?: [number, number]
    rotate?: [number, number, number]
  }

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: ProjectionConfig
    width?: number
    height?: number
    style?: CSSProperties
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (props: {
      geographies: Array<{
        rsmKey: string
        properties: {
          name?: string
          [key: string]: any
        }
        [key: string]: any
      }>
    }) => ReactNode
  }

  export interface GeographyProps {
    geography: any
    fill?: string
    fillOpacity?: number
    stroke?: string
    strokeWidth?: number
    onClick?: () => void
    style?: {
      default?: CSSProperties
      hover?: CSSProperties
      pressed?: CSSProperties
    }
  }

  export interface MarkerProps {
    coordinates: [number, number]
    onClick?: () => void
    style?: CSSProperties
    children?: ReactNode
  }

  export interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    children?: ReactNode
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const Geographies: React.FC<GeographiesProps>
  export const Geography: React.FC<GeographyProps>
  export const Marker: React.FC<MarkerProps>
  export const ZoomableGroup: React.FC<ZoomableGroupProps>
}

