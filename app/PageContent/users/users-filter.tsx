import Dropdown from "@/app/components/Dropdown/dropdown"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { FiFilter } from "react-icons/fi"

interface UserListFilterProps {}

export const UserListFilter: React.FC<UserListFilterProps> = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const defaultSort = (searchParams.get('sort') ?? '').trim().toLowerCase()
    const defaultFilterTodo = (searchParams.get('todo') ?? '').trim().toLowerCase()
    
    const [sort, setSort] = useState<string>(defaultSort)
    const [filter, setFilter] = useState<string>(defaultFilterTodo)
    
    const handleChangeParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
        params.set(key, value);
        } else {
        params.delete(key);
        }
        
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    }

    const handleChangeSort = (value: string) => {
        setSort(value)
        handleChangeParams('sort', value)
    }

    const handleChangeFilter = (value: string) => {
        setFilter(value)
        handleChangeParams('todo', value)
    }

    return (
        <Dropdown
            value=''
            onChange={() => {}}
        >
            <Dropdown.Trigger>
             <FiFilter />
            </Dropdown.Trigger>

            <Dropdown.OptionContainer>
            <Dropdown.OptionGroup value={filter} onChange={handleChangeFilter} title="Filter">
                <Dropdown.Option value="">
                    All users
                </Dropdown.Option>
                <Dropdown.Option value="pending">
                    All user with pending todos
                </Dropdown.Option>
                <Dropdown.Option value="no-completed">
                    All user without completed todos
                </Dropdown.Option>
            </Dropdown.OptionGroup>
            <Dropdown.OptionGroup value={sort} onChange={handleChangeSort} title="Sort">
                <Dropdown.Option value="a-z">
                    Name from A-Z
                </Dropdown.Option>
                <Dropdown.Option value="z-a">
                    Name from Z-A
                </Dropdown.Option>
            </Dropdown.OptionGroup>
            </Dropdown.OptionContainer>
        </Dropdown>
    )
}