import {ActionType} from './ActionType';
import {PackageAction} from './PackageAction';
class Action {
  private _type?: ActionType;
  private _config?: PackageAction;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    type?: ActionType,
    config?: PackageAction,
    additionalProperties?: Map<string, any>,
  }) {
    this._type = input.type;
    this._config = input.config;
    this._additionalProperties = input.additionalProperties;
  }

  get type(): ActionType | undefined { return this._type; }
  set type(type: ActionType | undefined) { this._type = type; }

  get config(): PackageAction | undefined { return this._config; }
  set config(config: PackageAction | undefined) { this._config = config; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
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

  public static unmarshal(json: string | object): Action {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new Action({} as any);

    if (obj["type"] !== undefined) {
      instance.type = obj["type"];
    }
    if (obj["config"] !== undefined) {
      instance.config = obj["config"];
    }

    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
      for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["type","config","additionalProperties"].includes(key);}))) {
        instance.additionalProperties.set(key, value as any);
      }

    return instance;
  }
}
export { Action };