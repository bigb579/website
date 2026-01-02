import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Blob "mo:core/Blob";

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    image : Blob;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      switch (Text.compare(p1.name, p2.name)) {
        case (#equal) { Nat.compare(p1.price, p2.price) };
        case (other) { other };
      };
    };
  };

  type OrderType = {
    id : Text;
    user : Principal;
    productId : Text;
    quantity : Nat;
    deliveryDetails : Text;
    companyLogo : Storage.ExternalBlob;
  };

  module OrderModule {
    public func compare(o1 : OrderType, o2 : OrderType) : Order.Order {
      switch (Nat.compare(o1.quantity, o2.quantity)) {
        case (#equal) { o1.id.compare(o2.id) };
        case (other) { other };
      };
    };
  };

  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, OrderType>();

  // User profile type as required by instructions
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public function - anyone can view product catalog
  public query ({ caller }) func getProductCatalog() : async [Product] {
    products.values().toArray().sort();
  };

  // User-only function - only authenticated users can place orders
  public shared ({ caller }) func placeOrder(productId : Text, quantity : Nat, deliveryDetails : Text, companyLogo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let orderId = productId.concat(quantity.toText()).concat(caller.toText());
    let order : OrderType = {
      id = orderId;
      user = caller;
      productId;
      quantity;
      deliveryDetails;
      companyLogo;
    };
    orders.add(orderId, order);
  };

  // User-only function - only authenticated users can view their orders
  public query ({ caller }) func getUserOrders() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(
      func(order) {
        order.user == caller;
      }
    );
  };

  // User-only function - only authenticated users can upload logos
  public shared ({ caller }) func uploadLogo(logo : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload logos");
    };
    logo;
  };

  // Admin-only function - initialize product catalog
  public shared ({ caller }) func initializeProductCatalog() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize product catalog");
    };
    let mug : Product = {
      id = "1";
      name = "Customized Mug";
      description = "Personalized ceramic mug";
      price = 10_00;
      image = Blob.fromArray([0x00, 0x01, 0x02]);
    };

    let pen : Product = {
      id = "2";
      name = "Branded Pen";
      description = "High-quality pen with your company logo";
      price = 5_00;
      image = Blob.fromArray([0x04, 0x05, 0x06]);
    };

    let tshirt : Product = {
      id = "3";
      name = "Custom T-Shirt";
      description = "Cotton t-shirt with custom print";
      price = 15_00;
      image = Blob.fromArray([0x08, 0x09, 0x0A]);
    };

    products.add("1", mug);
    products.add("2", pen);
    products.add("3", tshirt);
  };

  // Public function - anyone can view contact details
  public query ({ caller }) func getContactDetails() : async Text {
    "contact@corporategifts.com";
  };

  // User-only function - only authenticated users can create user profiles
  public shared ({ caller }) func createUser(name : Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    switch (userProfiles.get(caller)) {
      case (?_) { Runtime.trap("User already exists.") };
      case (null) {
        let profile : UserProfile = {
          name;
          email;
        };
        userProfiles.add(caller, profile);
      };
    };
  };

  // Admin-only function - view all orders
  public query ({ caller }) func getAllOrders() : async [OrderType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort();
  };

  // Admin-only function - add products to catalog
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, image : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = name.concat(price.toText());
    let product : Product = {
      id;
      name;
      description;
      price;
      image;
    };
    products.add(id, product);
  };
};
