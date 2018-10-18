export namespace at2 {
    interface Bird {
        fly();
        layEggs();
    }

    interface Fish {
        swim();
        layEggs();
    }

    function getSmallPet(): Fish | Bird {
        return {
            fly() { },
            swim() { },
            layEggs() { }
        };
    }

    let pet = getSmallPet();

    pet.layEggs(); // okay
    pet.swim();    // errors
}
