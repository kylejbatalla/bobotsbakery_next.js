// Single source of truth for everything orderable.
// `key` values are what the order API receives — don't rename them.
export const MAX_QTY = 5;

export const ITEMS = [
  { key: 'plain_pandesal_dz',      name: 'Plain Pandesal',          price: 8,  unit: 'per dozen',  label: '$8 / dozen' },
  { key: 'ube_pandesal_dz',        name: 'Ube Pandesal',            price: 8,  unit: 'per dozen',  label: '$8 / dozen' },
  { key: 'pandan_pandesal_dz',     name: 'Pandan Pandesal',         price: 8,  unit: 'per dozen',  label: '$8 / dozen' },
  { key: 'ube_cheese_pandesal_dz', name: 'Ube Pandesal w/ Cheese',  price: 10, unit: 'per dozen',  label: '$10 / dozen' },
  { key: 'spanish_bread_dz',       name: 'Spanish Bread (dozen)',   price: 15, unit: 'per dozen',  label: '$15 / dozen' },
  { key: 'spanish_bread_6',        name: 'Spanish Bread (6 pcs)',   price: 8,  unit: '/ 6 pcs',    label: '$8 / 6 pcs' },
  { key: 'cheese_rolls_dz',        name: 'Cheese Rolls (dozen)',    price: 15, unit: 'per dozen',  label: '$15 / dozen' },
  { key: 'cheese_rolls_6',         name: 'Cheese Rolls (6 pcs)',    price: 8,  unit: '/ 6 pcs',    label: '$8 / 6 pcs' },
  { key: 'plain_ensaymada_4',      name: 'Plain Ensaymada',         price: 8,  unit: '/ 4 pieces', label: '$8 / 4 pcs' },
  { key: 'ube_cheese_ensaymada_4', name: 'Ube & Cheese Ensaymada',  price: 10, unit: '/ 4 pieces', label: '$10 / 4 pcs' },
  { key: 'pan_de_coco_dz',         name: 'Pan de Coco (dozen)',     price: 15, unit: 'per dozen',  label: '$15 / dozen' },
  { key: 'pan_de_coco_6',          name: 'Pan de Coco (6 pcs)',     price: 8,  unit: '/ 6 pcs',    label: '$8 / 6 pcs' },
  { key: 'malunggay_pandesal_dz',  name: 'Malunggay Pandesal',      price: 10, unit: 'per dozen',  label: '$10 / dozen' },
];

export const ITEM_BY_KEY = Object.fromEntries(ITEMS.map(i => [i.key, i]));

// What shows on the Order page. `variants` are ITEMS keys, in display order.
export const PRODUCTS = [
  { name: 'Plain Pandesal', img: '/images/plain2.png', variants: ['plain_pandesal_dz'],
    desc: 'The classic — soft, slightly sweet Filipino bread rolls dusted with breadcrumbs. Perfect for breakfast with coffee.' },
  { name: 'Ube Pandesal', img: '/images/ubepandesal2.png', variants: ['ube_pandesal_dz'],
    desc: 'Pillowy purple yam pandesal — one of our most-requested products.' },
  { name: 'Pandan Pandesal', img: '/images/pandan2.png', variants: ['pandan_pandesal_dz'],
    desc: 'Fragrant pandan-infused pandesal with a soft green color.' },
  { name: 'Ube Pandesal w/ Cheese', img: '/images/ubepancheese.png', variants: ['ube_cheese_pandesal_dz'],
    desc: 'Our signature ube pandesal with a savory cheese filling.' },
  { name: 'Spanish Bread', img: '/images/spanish2.png', variants: ['spanish_bread_6', 'spanish_bread_dz'],
    desc: 'Sweet, buttery breadcrumb-coated rolls with a soft brown-sugar swirl tucked inside.' },
  { name: 'Cheese Rolls', img: '/images/cheese-roll.png', variants: ['cheese_rolls_6', 'cheese_rolls_dz'],
    desc: 'Soft, buttery breadcrumb-coated rolls with a rich, savory cheese filling tucked inside — a cheesy twist on a Filipino favorite.' },
  { name: 'Plain Ensaymada', img: '/images/ensay1.png', variants: ['plain_ensaymada_4'],
    desc: 'Soft, lightly sweet brioche-style rolls topped with a butter and sugar spread.' },
  { name: 'Ube & Cheese Ensaymada', img: '/images/ensay2.png', variants: ['ube_cheese_ensaymada_4'],
    desc: 'Soft, lightly sweet brioche-style rolls topped with a butter and sugar spread. Topped with a generous shower of grated cheese with an ube halaya filling.' },
  { name: 'Pan de Coco', img: '/images/coco2.png', variants: ['pan_de_coco_6', 'pan_de_coco_dz'],
    desc: 'Soft golden bread rolls with a sweet shredded coconut filling — a beloved Filipino breakfast staple.' },
  { name: 'Malunggay Pandesal', img: '/images/mal3.png', variants: ['malunggay_pandesal_dz'],
    desc: 'Pandesal enriched with malunggay (moringa) leaves — a nutritious, lightly herbal twist on the classic.' },
];

export const fmt = (n) => '$' + n.toFixed(0);
