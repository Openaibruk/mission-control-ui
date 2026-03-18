declare module 'cytoscape-fcose' {
  import { LayoutOptions } from 'cytoscape'
  
  interface FcoseLayoutOptions extends LayoutOptions {
    name: 'fcose'
    quality?: 'draft' | 'default' | 'proof'
    randomize?: boolean
    animate?: boolean | 'end'
    animationDuration?: number
    animationEasing?: string
    fit?: boolean
    padding?: number
    nodeDimensionsIncludeLabels?: boolean
    uniformNodeDimensions?: boolean
    packComponents?: boolean
    step?: 'all' | 'transformed'
    samplingType?: boolean
    sampleSize?: number
    nodeSeparation?: number
    piTol?: float
    nodeRepulsion?: (node: unknown) => number
    idealEdgeLength?: (edge: unknown) => number
    edgeElasticity?: (edge: unknown) => number
    nestingFactor?: number
    gravity?: number
    gravityRange?: number
    gravityCompound?: number
    gravityRangeCompound?: number
    numIter?: number
    tile?: boolean
    tilingPaddingVertical?: number
    tilingPaddingHorizontal?: number
    initialEnergyOnIncremental?: number
  }

  const ext: cytoscape.Ext
  export = ext
  export { FcoseLayoutOptions }
}
