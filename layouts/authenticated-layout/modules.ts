type Module = {
  name: string;
  displayName: string;
  href: string;
  disabled: false;
} | {
  displayName: string;
  disabled: true;
};

const modules: Array<Module> = [
  {
    name: "dashboard",
    displayName: "Dashboard",
    href: "/dashboard",
    disabled: false,
  },
  {
    name: "customers",
    displayName: "Customers",
    href: "/customers",
    disabled: false,
  },
  {
    displayName: "Suppliers",
    disabled: true,
  },
  {
    displayName: "Bookings",
    disabled: true
  },
];

export default modules;