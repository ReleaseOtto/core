import {AutomateVersion} from './AutomateVersion';
import {Location} from './Location';
import {Dependencies} from './Dependencies';
import {Action} from './Action';
class Automate {
  private _version?: AutomateVersion;
  private _id?: string;
  private _description?: string;
  private _location?: Location;
  private _dependencies?: Dependencies[];
  private _action?: Action;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    version?: AutomateVersion,
    id?: string,
    description?: string,
    location?: Location,
    dependencies?: Dependencies[],
    action?: Action,
    additionalProperties?: Map<string, any>,
  }) {
    this._version = input.version;
    this._id = input.id;
    this._description = input.description;
    this._location = input.location;
    this._dependencies = input.dependencies;
    this._action = input.action;
    this._additionalProperties = input.additionalProperties;
  }

  get version(): AutomateVersion | undefined { return this._version; }
  set version(version: AutomateVersion | undefined) { this._version = version; }

  get id(): string | undefined { return this._id; }
  set id(id: string | undefined) { this._id = id; }

  get description(): string | undefined { return this._description; }
  set description(description: string | undefined) { this._description = description; }

  get location(): Location | undefined { return this._location; }
  set location(location: Location | undefined) { this._location = location; }

  get dependencies(): Dependencies[] | undefined { return this._dependencies; }
  set dependencies(dependencies: Dependencies[] | undefined) { this._dependencies = dependencies; }

  get action(): Action | undefined { return this._action; }
  set action(action: Action | undefined) { this._action = action; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.version !== undefined) {
      json += `"version": ${typeof this.version === 'number' || typeof this.version === 'boolean' ? this.version : JSON.stringify(this.version)},`; 
    }
    if(this.id !== undefined) {
      json += `"id": ${typeof this.id === 'number' || typeof this.id === 'boolean' ? this.id : JSON.stringify(this.id)},`; 
    }
    if(this.description !== undefined) {
      json += `"description": ${typeof this.description === 'number' || typeof this.description === 'boolean' ? this.description : JSON.stringify(this.description)},`; 
    }
    if(this.location !== undefined) {
      json += `"location": ${this.location.marshal()},`; 
    }
    if(this.dependencies !== undefined) {
      json += `"dependencies": ${typeof this.dependencies === 'number' || typeof this.dependencies === 'boolean' ? this.dependencies : JSON.stringify(this.dependencies)},`; 
    }
    if(this.action !== undefined) {
      json += `"action": ${this.action.marshal()},`; 
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

  public static unmarshal(json: string | object): Automate {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new Automate({} as any);

    if (obj["version"] !== undefined) {
      instance.version = obj["version"];
    }
    if (obj["id"] !== undefined) {
      instance.id = obj["id"];
    }
    if (obj["description"] !== undefined) {
      instance.description = obj["description"];
    }
    if (obj["location"] !== undefined) {
      instance.location = Location.unmarshal(obj["location"]);
    }
    if (obj["dependencies"] !== undefined) {
      instance.dependencies = obj["dependencies"];
    }
    if (obj["action"] !== undefined) {
      instance.action = Action.unmarshal(obj["action"]);
    }

    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
      for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["version","id","description","location","dependencies","action","additionalProperties"].includes(key);}))) {
        instance.additionalProperties.set(key, value as any);
      }

    return instance;
  }
}
export { Automate };