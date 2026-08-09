function flattenObject(value, prefix = '', result = {}) {
  if (value === null || value === undefined) {
    result[prefix] = value;
    return result;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    result[prefix] = value;
    return result;
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    flattenObject(nestedValue, nextKey, result);
  });

  return result;
}

export default function ResultsTable({ responseData }) {
  if (!responseData || !responseData.hits || !Array.isArray(responseData.hits.hits)) {
    return null;
  }

  const flattenedRows = responseData.hits.hits.map((hit) => ({
    id: hit._id,
    ...flattenObject(hit._source || {})
  }));

  const columns = [];

  if (flattenedRows.length > 0) {
    columns.push(...Object.keys(flattenedRows[0]));
  }

  flattenedRows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
  });

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Search results</h2>
        <span>{flattenedRows.length} records</span>
      </div>
      <div className="results-table-wrap">
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flattenedRows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column) => (
                  <td key={column}>
                    <pre>{JSON.stringify(row[column], null, 2) ?? '-'}</pre>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
