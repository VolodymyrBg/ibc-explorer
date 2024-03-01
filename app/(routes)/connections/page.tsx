'use client';

import { useEffect, useState } from "react";
import {
  VisibilityState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable }
from "@tanstack/react-table";
import { IbcTable } from "@/components/ibc-table";
import { IdentifiedConnection } from "cosmjs-types/ibc/core/connection/v1/connection";
import { Modal } from "components/modal";

const columnHelper = createColumnHelper<IdentifiedConnection>();
const columns = [
  columnHelper.accessor('id', {
    header: 'Connection ID',
    enableHiding: true
  }),
  columnHelper.accessor('clientId', {
    header: 'Client ID',
    enableHiding: true
  }),
  columnHelper.accessor('state', {
    header: 'State',
    enableHiding: true
  }),
  columnHelper.accessor('counterparty.connectionId', {
    header: 'Counterparty Connection',
    enableHiding: true
  }),
  columnHelper.accessor('counterparty.clientId', {
    header: 'Counterparty Client',
    enableHiding: true
  }),
  columnHelper.accessor('delayPeriod', {
    header: 'Delay Period',
    enableHiding: true
  })
];

export default function Packets() {
  const [connections, setConnections] = useState<IdentifiedConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    fetch("/api/connections")
      .then(res => {
        if (!res.ok) {
          console.error(res.status);
          setError(true);
          setLoading(false);
        }
        return res.json();
      })
      .then(data => {
        setConnections(data);
        setLoading(false);
      }).catch(err => {
        setError(true);
        setLoading(false);
      });
  }

  const table = useReactTable({
    data: connections,
    columns,
    state: {
      columnVisibility
    },
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="">
      <Modal
        open={error} setOpen={setError}
        content={<>
          <h1>Error</h1>
          <p className="mt-2">There was an issue fetching connection data</p>
        </>}
      />

      <div className="flex flex-row justify-between mr-28">
        <h1 className="ml-1">Connections</h1>
        <button onClick={() => loadData()} className="btn btn-accent z-10 mr-4">
          Reload
        </button>
      </div>

      <IbcTable {...{table, loading}} />
    </div>
  );
}
