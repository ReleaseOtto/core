
class PackageAction {
  private _script: string;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    script: string,
    additionalProperties?: Map<string, any>,
  }) {
    this._script = input.script;
    this._additionalProperties = input.additionalProperties;
  }

  get script(): string { return this._script; }
  set script(script: string) { this._script = script; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.script !== undefined) {
      json += `"script": ${typeof this.script === 'number' || typeof this.script === 'boolean' ? this.script : JSON.stringify(this.script)},`; 
    }
    if(this.additionalProperties !== undefined) { 
    for (const [key, value] of this.additionalProperties.entries()) {
      //Only unwrap those who are not already a property in the JSON object
      if(Object.keys(this).includes(String(key))) continue;
        json += `"${key}": ${typeof value === 'number' || typeof value === 'boolean' ? value : JSON.stringify(value)},`;
      }
    }

    //Remove potential last comma 
    return `${json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}`;
  }

  public static unmarshal(json: string | object): PackageAction {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new PackageAction({} as any);

    if (obj["script"] !== undefined) {
      instance.script = obj["script"];
    }

    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
      for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["script","additionalProperties"].includes(key);}))) {
        instance.additionalProperties.set(key, value as any);
      }

    return instance;
  }
}
export { PackageAction };