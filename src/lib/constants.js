export const sections = {
  classes: {
    id: 'classes',
    label: 'Clases',
    path: '/classes'
  },
  cases: {
    id: 'cases',
    label: 'Casos de estudio',
    path: '/cases'
  },
  tests: {
    id: 'tests',
    label: 'Interrogaciones',
    path: '/tests'
  },
  others: {
    id: 'others',
    label: 'Otros',
    path: '/others'
  }
};

export const contentTypes = {
  patterns: {
    classes: /^clase-/i,
    cases: /^caso-/i,
    tests: /^(i|examen)-/i,
    others: /^otros-/i
  },
  default: 'classes'
};