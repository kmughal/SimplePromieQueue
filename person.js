class Person {
  constructor(name, isManager, isEmployee, manager) {
    this.name = name;
    this.isManager = isManager;
    this.isEmployee = isEmployee;
    this.manager = manager;
  }
}

class PersonBuilder {
  constructor(name) {
    this.name = name;
    this.isEmployee = false;
    this.isManager = false;
    this.managedBy = null;
  }

  makeEmployee() {
    this.isEmployee = true;
    this.isManager = false;
    return this;
  }

  managedBy(name) {
    this.manager = name;
    return this;
  }

  makeManager() {
    this.isEmployee = false;
    this.isManager = true;
  }

  build() {
    return new Person(this.name, this.isEmployee, this.isManager, this.manager);
  }

}

// Example of builder pattern.
new PersonBuilder("Peter")
  .makeEmployee()
  .managedBy("Khurram")
  .build();

module.exports.Person = Person;