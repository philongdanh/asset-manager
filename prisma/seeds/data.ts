export const TENANTS = [
  {
    id: 'tenant-1',
    name: 'IIT JSC',
    code: 'IIT',
    status: 'ACTIVE',
    email: 'contact@iit.com.vn',
    phone: '024 1234 5678',
    address: '1 Dai Co Viet, Hanoi',
    website: 'https://iit.com.vn',
    logo: '/logos/iit-logo.png',
  },
  {
    id: 'tenant-2',
    name: 'ABC Technology',
    code: 'ABC',
    status: 'ACTIVE',
    email: 'info@abc-tech.com',
    phone: '028 8765 4321',
    address: '5th Floor, 123 Nguyen Van Linh, HCMC',
    website: 'https://abc-tech.com',
    logo: '/logos/abc-logo.png',
  },
];

export const PERMISSIONS = [
  // Asset Management
  { id: 'perm-1', name: 'ASSET_VIEW', description: 'View assets' },
  { id: 'perm-2', name: 'ASSET_CREATE', description: 'Create assets' },
  { id: 'perm-3', name: 'ASSET_EDIT', description: 'Edit assets' },
  { id: 'perm-4', name: 'ASSET_DELETE', description: 'Delete assets' },
  { id: 'perm-5', name: 'ASSET_TRANSFER', description: 'Transfer assets' },
  { id: 'perm-6', name: 'ASSET_DISPOSE', description: 'Dispose assets' },

  // Inventory Management
  { id: 'perm-7', name: 'INVENTORY_VIEW', description: 'View inventory' },
  {
    id: 'perm-8',
    name: 'INVENTORY_CREATE',
    description: 'Create inventory items',
  },
  { id: 'perm-9', name: 'INVENTORY_EDIT', description: 'Edit inventory items' },
  {
    id: 'perm-10',
    name: 'INVENTORY_TRANSFER',
    description: 'Transfer inventory',
  },

  // User Management
  { id: 'perm-11', name: 'USER_MANAGE', description: 'Manage users' },
  { id: 'perm-12', name: 'ROLE_MANAGE', description: 'Manage roles' },

  // Department Management
  {
    id: 'perm-13',
    name: 'DEPARTMENT_MANAGE',
    description: 'Manage departments',
  },

  // Reports
  { id: 'perm-14', name: 'REPORT_VIEW', description: 'View reports' },

  // System
  { id: 'perm-15', name: 'SYSTEM_SETTINGS', description: 'System settings' },
];

export const ROLE_TEMPLATES = [
  {
    suffix: 'admin',
    name: 'System Administrator',
    color: '#FF0000',
    allPermissions: true,
  },
  {
    suffix: 'manager',
    name: 'Manager',
    color: '#00FF00',
    allPermissions: false, // logic handled in loop
  },
  {
    suffix: 'staff',
    name: 'Staff',
    color: '#0000FF',
    allPermissions: false,
    permissions: ['ASSET_VIEW', 'INVENTORY_VIEW', 'REPORT_VIEW'],
  },
];

export const DEPARTMENTS = [
  { name: 'Board of Directors', code: 'BOARD', parentCode: null },
  { name: 'Human Resources', code: 'HR', parentCode: 'BOARD' },
  { name: 'Recruitment', code: 'RECRUIT', parentCode: 'HR' },
  { name: 'Training', code: 'TRAIN', parentCode: 'HR' },
  { name: 'IT Dept', code: 'IT', parentCode: 'BOARD' },
  { name: 'Infrastructure', code: 'INFRA', parentCode: 'IT' },
  { name: 'Software Development', code: 'DEV', parentCode: 'IT' },
  { name: 'Finance', code: 'FIN', parentCode: 'BOARD' },
  { name: 'Accounting', code: 'ACC', parentCode: 'FIN' },
  { name: 'Auditing', code: 'AUDIT', parentCode: 'FIN' },
  { name: 'Sales & Marketing', code: 'SALES', parentCode: 'BOARD' },
];

export const ASSET_CATEGORIES = [
  { code: 'ELEC', name: 'Electronics', parentCode: null },
  { code: 'COMP', name: 'Computers', parentCode: 'ELEC' },
  { code: 'LAPTOP', name: 'Laptops', parentCode: 'COMP' },
  { code: 'DESKTOP', name: 'Desktops', parentCode: 'COMP' },
  { code: 'PERIPH', name: 'Peripherals', parentCode: 'ELEC' },
  { code: 'MONITOR', name: 'Monitors', parentCode: 'PERIPH' },
  { code: 'KEYBOARD', name: 'Keyboards', parentCode: 'PERIPH' },
  { code: 'FURN', name: 'Furniture', parentCode: null },
  { code: 'DESK', name: 'Desks', parentCode: 'FURN' },
  { code: 'CHAIR', name: 'Chairs', parentCode: 'FURN' },
  { code: 'VEHICLE', name: 'Vehicles', parentCode: null },
];

export const ASSET_TEMPLATES_DATA = [
  // Laptops
  {
    code: 'LAP-DELL-5440',
    name: 'Laptop Dell Latitude 5440',
    model: 'Latitude 5440',
    manufacturer: 'Dell',
    categoryCode: 'LAPTOP',
    defaultPurchasePrice: 1200,
    requireSerial: true,
    canDepreciate: true,
  },
  {
    code: 'LAP-MAC-M2',
    name: 'MacBook Air M2',
    model: 'MacBook Air 13-inch',
    manufacturer: 'Apple',
    categoryCode: 'LAPTOP',
    defaultPurchasePrice: 1100,
    requireSerial: true,
    canDepreciate: true,
  },
  // Desktops
  {
    code: 'PC-HP-PRO',
    name: 'HP ProDesk Desktop',
    model: 'ProDesk 400 G9',
    manufacturer: 'HP',
    categoryCode: 'DESKTOP',
    defaultPurchasePrice: 800,
    requireSerial: true,
    canDepreciate: true,
  },
  // Peripherals
  {
    code: 'MON-DELL-24',
    name: 'Dell 24 Monitor',
    model: 'P2419H',
    manufacturer: 'Dell',
    categoryCode: 'MONITOR',
    defaultPurchasePrice: 200,
    requireSerial: true,
    canDepreciate: true,
  },
  {
    code: 'PRINTER-HP',
    name: 'HP LaserJet Printer',
    model: 'LaserJet Pro M404dn',
    manufacturer: 'HP',
    categoryCode: 'PERIPH',
    defaultPurchasePrice: 350,
    requireSerial: true,
    canDepreciate: true,
  },
  // Furniture
  {
    code: 'CHAIR-HERMAN',
    name: 'Herman Miller Aeron',
    model: 'Aeron Size B',
    manufacturer: 'Herman Miller',
    categoryCode: 'CHAIR',
    defaultPurchasePrice: 1200,
    requireSerial: false,
    canDepreciate: true,
  },
];

export const INVENTORY_ITEMS = [
  {
    sku: 'PAPER-A4-80GSM',
    name: 'A4 Paper Double A 80gsm',
    unit: 'ream',
    currentStock: 50,
    unitCost: 5,
    categoryCode: 'PERIPH', // Fitting it here for now or make a STATIONERY category
    storageLocation: 'Supply Room',
  },
  {
    sku: 'PEN-BLUE',
    name: 'Blue Ballpoint Pen',
    unit: 'pc',
    currentStock: 200,
    unitCost: 0.5,
    categoryCode: 'PERIPH',
    storageLocation: 'Supply Room',
  },
  {
    sku: 'TONER-HP-83A',
    name: 'HP 83A Toner Cartridge',
    unit: 'box',
    currentStock: 10,
    unitCost: 80,
    categoryCode: 'PERIPH',
    storageLocation: 'IT Storage',
  },
  {
    sku: 'CABLE-NET-5M',
    name: 'Ethernet Cable CAT6 5m',
    unit: 'roll',
    currentStock: 15,
    unitCost: 10,
    categoryCode: 'PERIPH',
    storageLocation: 'IT Storage',
  },
  {
    sku: 'KEYBOARD-LOGI',
    name: 'Logitech K120 Keyboard',
    unit: 'pc',
    currentStock: 20,
    unitCost: 15,
    categoryCode: 'KEYBOARD',
    storageLocation: 'IT Storage',
  },
];

export const REALISTIC_USERS = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'jdoe',
    email: 'john.doe@example.com',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'jsmith',
    email: 'jane.smith@example.com',
  },
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    username: 'rjohnson',
    email: 'robert.j@example.com',
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    username: 'edavis',
    email: 'emily.d@example.com',
  },
  {
    firstName: 'Michael',
    lastName: 'Wilson',
    username: 'mwilson',
    email: 'michael.w@example.com',
  },
  {
    firstName: 'Sarah',
    lastName: 'Brown',
    username: 'sbrown',
    email: 'sarah.b@example.com',
  },
  {
    firstName: 'David',
    lastName: 'Jones',
    username: 'djones',
    email: 'david.j@example.com',
  },
  {
    firstName: 'Jennifer',
    lastName: 'Garcia',
    username: 'jgarcia',
    email: 'jen.g@example.com',
  },
  {
    firstName: 'James',
    lastName: 'Miller',
    username: 'jmiller',
    email: 'james.m@example.com',
  },
  {
    firstName: 'Linda',
    lastName: 'Martinez',
    username: 'lmartinez',
    email: 'linda.m@example.com',
  },
];

export const BUDGET_PLANS_DATA = [
  { type: 'Assets', amount: 20000, spent: 6000 },
  { type: 'Inventory', amount: 8000, spent: 3000 },
  { type: 'Maintenance', amount: 4000, spent: 1000 },
];
