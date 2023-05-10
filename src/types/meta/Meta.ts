
class Meta {
  private _dependencies?: any;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    dependencies?: any,
    additionalProperties?: Map<string, any>,
  }) {
    this._dependencies = input.dependencies;
    this._additionalProperties = input.additionalProperties;
  }

  get dependencies(): any | undefined { return this._dependencies; }
  set dependencies(dependencies: any | undefined) { this._dependencies = dependencies; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.dependencies !== undefined) {
      json += `"dependencies": ${typeof this.dependencies === 'number' || typeof this.dependencies === 'boolean' ? this.dependencies : JSON.stringify(this.dependencies)},`; 
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

  public static unmarshal(json: string | object): Meta {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new Meta({} as any);

    if (obj["dependencies"] !== undefined) {
      instance.dependencies = obj["dependencies"];
    }

    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
      for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["dependencies","additionalProperties"].includes(key);}))) {
        instance.additionalProperties.set(key, value as any);
      }

    return instance;
  }
}
export { Meta };