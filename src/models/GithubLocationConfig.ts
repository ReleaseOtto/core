
class GithubLocationConfig {
  private _owner: string;
  private _repo: string;
  private _branch?: string;
  private _metaMinusLocation: string;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    owner: string,
    repo: string,
    branch?: string,
    metaMinusLocation: string,
    additionalProperties?: Map<string, any>,
  }) {
    this._owner = input.owner;
    this._repo = input.repo;
    this._branch = input.branch;
    this._metaMinusLocation = input.metaMinusLocation;
    this._additionalProperties = input.additionalProperties;
  }

  get owner(): string { return this._owner; }
  set owner(owner: string) { this._owner = owner; }

  get repo(): string { return this._repo; }
  set repo(repo: string) { this._repo = repo; }

  get branch(): string | undefined { return this._branch; }
  set branch(branch: string | undefined) { this._branch = branch; }

  get metaMinusLocation(): string { return this._metaMinusLocation; }
  set metaMinusLocation(metaMinusLocation: string) { this._metaMinusLocation = metaMinusLocation; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public marshal() : string {
    let json = '{'
    if(this.owner !== undefined) {
      json += `"owner": ${typeof this.owner === 'number' || typeof this.owner === 'boolean' ? this.owner : JSON.stringify(this.owner)},`; 
    }
    if(this.repo !== undefined) {
      json += `"repo": ${typeof this.repo === 'number' || typeof this.repo === 'boolean' ? this.repo : JSON.stringify(this.repo)},`; 
    }
    if(this.branch !== undefined) {
      json += `"branch": ${typeof this.branch === 'number' || typeof this.branch === 'boolean' ? this.branch : JSON.stringify(this.branch)},`; 
    }
    if(this.metaMinusLocation !== undefined) {
      json += `"meta-location": ${typeof this.metaMinusLocation === 'number' || typeof this.metaMinusLocation === 'boolean' ? this.metaMinusLocation : JSON.stringify(this.metaMinusLocation)},`; 
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

  public static unmarshal(json: string | object): GithubLocationConfig {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    const instance = new GithubLocationConfig({} as any);

    if (obj["owner"] !== undefined) {
      instance.owner = obj["owner"];
    }
    if (obj["repo"] !== undefined) {
      instance.repo = obj["repo"];
    }
    if (obj["branch"] !== undefined) {
      instance.branch = obj["branch"];
    }
    if (obj["meta-location"] !== undefined) {
      instance.metaMinusLocation = obj["meta-location"];
    }

    if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
      for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["owner","repo","branch","metaMinusLocation","additionalProperties"].includes(key);}))) {
        instance.additionalProperties.set(key, value as any);
      }

    return instance;
  }
}
export { GithubLocationConfig };