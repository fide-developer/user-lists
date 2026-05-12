import Skeleton from "@/app/components/Skeleton";
import Table from "@/app/components/Table";

const PLACEHOLDER_ROWS = 5;

export default function UsersLoader() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head className="hidden md:table-cell">Username</Table.Head>
          <Table.Head className="hidden lg:table-cell">Company</Table.Head>
          <Table.Head className="hidden lg:table-cell">City</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: PLACEHOLDER_ROWS }).map((_, i) => (
          <Table.Row key={i}>
            <Table.Cell>
              <Skeleton className="h-4 w-32" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-48" />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <Skeleton className="h-4 w-24" />
            </Table.Cell>
            <Table.Cell className="hidden lg:table-cell">
              <Skeleton className="h-4 w-36" />
            </Table.Cell>
            <Table.Cell className="hidden lg:table-cell">
              <Skeleton className="h-4 w-24" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
