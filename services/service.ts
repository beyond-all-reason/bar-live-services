export abstract class Service {
    public init() : Promise<this> {
        return new Promise((resolve) => {
            resolve(this);
        });
    }
}
