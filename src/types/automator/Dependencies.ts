import {DependenciesType} from './DependenciesType';
import {GithubRepositoryPackage} from './GithubRepositoryPackage';
class Dependencies {
  private _id: string;
  private _type: DependenciesType;
  private _config?: GithubRepositoryPackage;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    id: string,
    type: DependenciesType,
    config?: GithubRepositoryPackage,
    additionalProperties?: Map<string, any>,
  }) {
    this._id = input.id;
    this._type = input.type;
    this._config = input.config;
    this._additionalProperties = input.additionalProperties;
  }

  get id(): string { return this._id; }
  set id(id: string) { this._id = id; }

  get type(): DependenciesType { return this._type; }
  set type(type: DependenciesType) { this._type = type; }

  get config(): GithubRepositoryPackage | undefined { return this._config; }
  set config(config: GithubRepositoryPackage | undefined) { this._config = config; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.id !== undefined) {
      json += `"id": ${typeof this.id === 'number' || typeof this.id === 'boolean' ? this.id : JSON.stringify(this.id)},`; 
    }
    if(this.type !== undefined) {
      json += `"type": ${typeof this.type === 'number' || typeof this.type === 'boolean' ? this.type : JSON.stringify(this.type)},`; 
    }
    if(this.config !== undefined) {
      json += `"config": ${typeof this.config === 'number' || typeof this.config === 'boolean' ? this.config : JSON.stringify(this.config)},`; 
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

  public static unmarshal(json: string | object): Dependencies {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new Dependencies({} as any);

    if (obj["id"] !== undefined) {
      instance.id = obj["id"];
    }
    if (obj["type"] !== undefined) {
      instance.type = obj["type"];
    }
    if (obj["config"] !== undefined) {
      instance.config = obj["config"];
    }

    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
      for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["id","type","config","additionalProperties"].includes(key);}))) {
        instance.additionalProperties.set(key, value as any);
      }

    return instance;
  }
}
export { Dependencies };