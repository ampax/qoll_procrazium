Schemas = {};

Template.registerHelper("Schemas", Schemas);


/******* Single quick qoll collectoin less schema *******/
Schemas.quick_qoll = new SimpleSchema({
  send_to: {
    type: [String],
    label: "Send To",
    // regEx: SimpleSchema.RegEx.Email,
    max: 500,
    optional: true
  },
  title: {
    type: String,
    label: "Title",
    max: 50
  },
  qollText: {
    type: String,
    label: "Qoll",
    min: 10,
    max: 200
  },
  image: {
    type: String,
    label: "Image",
    min: 60,
    max: 400,
    optional: true
  },
  qollTypes: {
    type: Array,
    label: "Qoll Options",
    optional: true
  },
  'qollTypes.$': {
    type: String
  },
  explanation: {
    type: String,
    label: "Explanation",
    max: 2000,
    optional: true,
    autoform: {
      rows: 10
    }
  },
});


Schemas.share_circle_assign = new SimpleSchema({
  email: {
    type: [String],
    label: "Email of the person (Select by typing email-id)",
    max: 500,
    optional: false
  },
  share_circle: {
    type: [String],
    label: "Share Circle (Select by typing share-circle)",
    max: 500,
    optional: false
  },
});

Schemas.custom_group_subscribe = new SimpleSchema({
  group_name: {
    type: [String],
    label: "Group Name (Subscribe to this group, search by typing author's email-id)",
    // regEx: SimpleSchema.RegEx.Email,
    max: 500,
    optional: true
  },
});

Schemas.custom_collab_group= new SimpleSchema({
  collab_groups: {
    type: [String],
    label: "Group Name (Default collaboration group to quickly share all the qolls with, search by typing your group names)",
    // regEx: SimpleSchema.RegEx.Email,
    max: 500,
    optional: true
  },
  add_subscriber: {
    type: [String],
    label: "Add Subscriber",
    max: 500,
    optional: true
  },
});

Schemas.custom_questionnaire = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 300
  },
  share_with: {
    type: [String],
    label: "Share With (share the questionnaire)",
    max: 500,
    optional: true
  },
  send_to: {
    type: [String],
    label: "Send To",
    max: 500
  },
  tags: {
    type: [String],
    label: "Tags (used to quickly search)",
    max: 500,
    optional: true,
  },
  topics: {
    type: [String],
    label: "Topics (used to structurely store content)",
    max: 500,
    optional: true,
  },
  end_time: {
    type: Date,
    label: "Deadline",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "bootstrap-datetimepicker"
      }
    }
  },/**{
    type: String,
    label: "Deadline11",
    max: 500,
    optional: true
  }**/
  state: {
    type: String,
    optional: false,
    defaultValue: 'stored'
  },
});


Schemas.custom_markdown_menu_options = new SimpleSchema({
  share_with: {
    type: [String],
    label: "Share With (share the content with person or group)",
    max: 500,
    optional: true
  },
  tags: {
    type: [String],
    label: "Tags (used to quickly search)",
    max: 500,
    optional: true,
  },
  topics: {
    type: [String],
    label: "Topics (used to structurely store content)",
    max: 500,
    optional: true,
  },
});



/****** This is contact us collection less schema ******/
Schemas.contact = new SimpleSchema({
    name: {
        type: String,
        label: "Your name",
        max: 50
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address"
    },
    from: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "From"
    },
    message: {
        type: String,
        label: "Message",
        max: 1000
    }
});



/** 1
Schemas.Person = new SimpleSchema({
  firstName: {
    type: String,
    index: 1,
    unique: true
  },
  lastName: {
    type: String,
    optional: true
  },
  age: {
    type: Number,
    optional: true
  }
});

var Collections = {};

Template.registerHelper("Collections", Collections);

People = Collections.People = new Mongo.Collection("People");
People.attachSchema(Schemas.Person);

Meteor.publish(null, function () {
  return People.find();
});

People.allow({
  insert: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});
**/

/** 2
Books = new Mongo.Collection("books");
Books.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  author: {
    type: String,
    label: "Author"
  },
  copies: {
    type: Number,
    label: "Number of copies",
    min: 0
  },
  lastCheckedOut: {
    type: Date,
    label: "Last date this book was checked out",
    optional: true
  },
  summary: {
    type: String,
    label: "Brief summary",
    optional: true,
    max: 1000
  }
}));
**/

Schemas.FieldsExamples = new SimpleSchema({
  name: {
    type: String
  },
  phone: {
    type: String,
    optional: true
  },
  address: {
    type: Object
  },
  'address.street': {
    type: String
  },
  'address.street2': {
    type: String,
    optional: true
  },
  'address.city': {
    type: String
  },
  'address.state': {
    type: String,
    allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
    autoform: {
      afFieldInput: {
        firstOption: "(Select a State)"
      }
    }
  },
  'address.postalCode': {
    type: String,
    label: "ZIP"
  },
  contacts: {
    type: Array,
    optional: true
  },
  'contacts.$': {
    type: Object
  },
  'contacts.$.name': {
    type: String
  },
  'contacts.$.phone': {
    type: String
  }
});