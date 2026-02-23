import { Injectable } from "@nestjs/common";
import { OfxParserPort } from "../../../../core/port/ofx-parser.port";

const { parse } = require("ofx-js");

@Injectable()
export class OfxJsParserAdapter implements OfxParserPort {
  async parse(ofxContent: string): Promise<any> {
    return parse(ofxContent);
  }
}

