var filename = 'lib/ReactiveDataSource.js';

ReactiveDataSource = {
	/**
		deps will store the same keys as above but the value will be a Deps.Dependency:
		{'ajpKkwLjAMAhG7DEK' : new Deps.Dependency}
	**/
	deps: {},

	init: function(key){
		qlog.info('Initializing dependency for ' + key, filename);
		this.ensureDeps(key);
		return this.deps[key];
	},

	/**
		Make sure that we have created a dependency object for the key and then call depend()
		method to create a dependency. Finally return the value.
	**/
	/**get: function(key){
		this.ensureDeps(key);
		this.deps[key].depend();
		return this.deps[key];
	},**/
	depend: function(key){
		qlog.info('Creating dependency for ' + key, filename);
		this.ensureDeps(key);
		this.deps[key].depend();
		return this.deps[key];
	},

	/**
		Call refresh on ReactiveDataSource with the key which creates dependency and
		calls changed on the data-source
	**/
	refresh: function(key){
		qlog.info('Refreshing dependency for ' + key, filename);
		this.ensureDeps(key);
		this.deps[key].changed();
	},

	/**
		Set the value of the key to the new value and then call the changed() method on the
		dependency object which will trigger the dependent functions to be re-run
	**/
	/**set: function(key, value){
		this.ensureDeps(key);
		this.keys[key] = value;
		this.deps[key].changed();
	},**/

	/**
	**/
	ensureDeps: function(key){
		if(!this.deps[key])
			this.deps[key] = new Deps.Dependency;

		this.deps[key].depend();
	}
};