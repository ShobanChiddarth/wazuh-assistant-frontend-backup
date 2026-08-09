export const initialQuery = {
  size: 2,
  _source: [
    '@timestamp',
    'agent.name',
    'agent.ip',
    'agent.id',
    'rule.id',
    'rule.level',
    'rule.description',
    'decoder.name',
    'full_log'
  ],
  query: {
    bool: {
      filter: [
        {
          term: {
            'rule.id': '550'
          }
        }
      ]
    }
  },
  sort: [
    {
      '@timestamp': {
        order: 'desc'
      }
    }
  ]
};
