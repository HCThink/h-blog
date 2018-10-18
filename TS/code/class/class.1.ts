namespace in1 {
    class Animal {
        name: string;
        constructor(theName: string) { this.name = theName; }
        move(distanceInMeters: number = 0) {
            console.log(`${this.name} moved ${distanceInMeters}m.`);
        }
    }

    class Snake extends Animal {
        constructor(name: string) { super(name); }
        move(distanceInMeters = 5) {
            console.log("Slithering...");
            super.move(distanceInMeters);
        }
    }

    class Horse extends Animal {
        addr: string;
        constructor(name: string, addr?: string) {
            // super 不必再第一行，但是必须在 this 之前。
            addr = addr || 'china';
            super(name);
            this.addr = addr;
        }
        // override
        move(distanceInMeters = 45) {
            console.log("Galloping...");
            // super 可以在子类里随意使用。
            super.move(distanceInMeters);
        }
    }

    let sam = new Snake("Sammy the Python");
    let tom: Animal = new Horse("Tommy the Palomino");

    sam.move();
    tom.move(34);
}
