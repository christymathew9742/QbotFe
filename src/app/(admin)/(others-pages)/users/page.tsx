"use client";

import { WhatsappUser } from "@/section/whatsapp/user";

export default WhatsappUser;
// import * as React from 'react';
// import { DataGrid, GridFilterModel } from '@mui/x-data-grid';
// import { useDemoData } from '@mui/x-data-grid-generator';

// const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

// export default function ReadOnlyFilters() {
//   const { data, loading } = useDemoData({
//     dataSet: 'Employee',
//     visibleFields: VISIBLE_FIELDS,
//     rowLength: 100,
//   });

//   const columns = React.useMemo(
//     () =>
//       data.columns.map((column:any) => ({
//         ...column,
//         filterable: column.field !== 'name',
//       })),
//     [data.columns],
//   );

//   const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
//     items: [
//       {
//         field: 'name',
//         operator: 'contains',
//         value: 'a',
//       },
//     ],
//   });

//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         {...data}
//         loading={loading}
//         columns={columns}
//         showToolbar
//         filterModel={filterModel}
//         onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
//       />
//     </div>
//   );
// }