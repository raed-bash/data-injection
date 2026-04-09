export default {
  data: "data/file.json",

  replacer: {
    on: false,
    columns: {
      original_name: "new_column_name",
      anothr_column: "another_new_column_name",
    },
    values: {
      new_column_name: "assigned_value", // the new name you assigned in columns replacer, will replace all values in this column with the assigned value
      another_new_column_name: "another_assigned_value", // the new name you assigned in columns replacer, will replace all values in this column with the assigned value
      column_name: {
        // conditional value replacement, the key is the column name, and the value is an object that contains the old value as a key and the new value as a value
        old_value_1: "new_value_1", // if the value in the column is old_value_1, it will be replaced with new_value_1
        old_value_2: "new_value_2", // if the value in the column is old_value_2, it will be replaced with new_value_2
        // if the value in the column is not found in the values object, it will stay the same
      },
    },
  },
  api: {
    endpoint: "server_endpoint_here",
    method: "method_here",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer your_token_here",
    },
  },
};
