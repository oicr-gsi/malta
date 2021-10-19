export interface Data {
    gamma: SolutionData[];
}
  
interface SolutionData {
    id: Number;
    cellularity: Number;
    ploidy: Number;
    // quotes required to prevent '.' in sd.BAF from throwing an error
    "sd.BAF": Number;
    path: String;
}
  
export interface Primary {
    genome_view: PrimaryData[];
    model_fit: PrimaryData[];
}
  
export interface PrimaryData {
    file: String;
    gamma: Number;
  }