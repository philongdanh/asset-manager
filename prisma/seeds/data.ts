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
  { name: 'Board of Directors', parentId: null },
  { name: 'Accounting Dept', parentId: null },
  { name: 'HR Dept', parentId: null },
  { name: 'IT Dept', parentId: null },
  { name: 'Sales Dept', parentId: null },
];

export const IT_SUB_DEPARTMENTS = [
  'Support Team',
  'Development Team',
  'Network Team',
];

export const ASSET_CATEGORIES = [
  { code: 'IT-EQ', name: 'IT Equipment' },
  { code: 'OFFICE-EQ', name: 'Office Equipment' },
  { code: 'VEHICLE', name: 'Vehicles' },
  { code: 'FURNITURE', name: 'Furniture' },
  { code: 'MACHINE', name: 'Machinery' },
];

export const ASSET_TEMPLATES_DATA = [
  // IT Equipment
  {
    code: 'LAP-DELL-5440',
    name: 'Laptop Dell Latitude 5440',
    model: 'Latitude 5440',
    manufacturer: 'Dell',
    categoryCode: 'IT-EQ',
    defaultPurchasePrice: 1000,
    requireSerial: true,
    canDepreciate: true,
  },
  {
    code: 'PC-HP-PRO',
    name: 'HP ProDesk Desktop',
    model: 'ProDesk 400 G9',
    manufacturer: 'HP',
    categoryCode: 'IT-EQ',
    defaultPurchasePrice: 600,
    requireSerial: true,
    canDepreciate: true,
  },
  {
    code: 'PRINTER-HP',
    name: 'HP LaserJet Printer',
    model: 'LaserJet Pro M404dn',
    manufacturer: 'HP',
    categoryCode: 'OFFICE-EQ',
    defaultPurchasePrice: 300,
    requireSerial: true,
    canDepreciate: true,
  },
  // Office Equipment
  {
    code: 'AC-SAMSUNG',
    name: 'Samsung Air Conditioner',
    model: 'AR9500T',
    manufacturer: 'Samsung',
    categoryCode: 'OFFICE-EQ',
    defaultPurchasePrice: 500,
    requireSerial: true,
    canDepreciate: true,
  },
  {
    code: 'PROJECTOR-EPSON',
    name: 'Epson Projector',
    model: 'EB-E01',
    manufacturer: 'Epson',
    categoryCode: 'OFFICE-EQ',
    defaultPurchasePrice: 400,
    requireSerial: true,
    canDepreciate: true,
  },
];

export const INVENTORY_ITEMS = [
  {
    sku: 'PAPER-A4-80GSM',
    name: 'A4 Paper Double A 80gsm',
    unit: 'ream',
    currentStock: 50,
    unitCost: 2,
    categoryCode: 'OFFICE-EQ',
    storageLocation: 'Office Supply Room',
  },
  {
    sku: 'PEN-BLUE',
    name: 'Blue Ballpoint Pen',
    unit: 'pc',
    currentStock: 200,
    unitCost: 0.2,
    categoryCode: 'OFFICE-EQ',
    storageLocation: 'Office Supply Room',
  },
  {
    sku: 'TONER-HP-83A',
    name: 'HP 83A Toner Cartridge',
    unit: 'box',
    currentStock: 10,
    unitCost: 35,
    categoryCode: 'OFFICE-EQ',
    storageLocation: 'IT Storage',
  },
  {
    sku: 'CABLE-NET-5M',
    name: 'Ethernet Cable CAT6 5m',
    unit: 'roll',
    currentStock: 15,
    unitCost: 5,
    categoryCode: 'OFFICE-EQ',
    storageLocation: 'IT Storage',
  },
  {
    sku: 'KEYBOARD-LOGI',
    name: 'Logitech K120 Keyboard',
    unit: 'pc',
    currentStock: 20,
    unitCost: 10,
    categoryCode: 'OFFICE-EQ',
    storageLocation: 'IT Storage',
  },
];

export const BUDGET_PLANS_DATA = [
  { type: 'Assets', amount: 20000, spent: 6000 },
  { type: 'Inventory', amount: 8000, spent: 3000 },
  { type: 'Maintenance', amount: 4000, spent: 1000 },
];
