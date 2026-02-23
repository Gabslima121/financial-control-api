export interface OfxParserPort {
  parse(ofxContent: string): Promise<any>;
}

