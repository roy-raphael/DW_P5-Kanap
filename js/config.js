export class Config {
    // Attributes
    #config = {};
    static #instance = null;

    static async loadConfig(){
        let result = await fetch("../config.json");
        return result.json();
    }

    // Static method : returns the only instance of this class (and create it if it does not exist)
    static async getInstance() {
        if (Config.#instance === null) {
            Config.#instance = new Config();
        }
        if (this.#instance.#config // null and undefined check
        && Object.keys(this.#instance.#config).length === 0
        && Object.getPrototypeOf(this.#instance.#config) === Object.prototype) {
            let conf = await Config.loadConfig();
            conf && Object.assign(this.#instance.#config, conf);
        }
        return Config.#instance;
    }

    // Constructor of the class
    constructor () {
    }

    // Getter : returns the host
    getHost() {
        return this.#config.host;
    }
}