
import { UserRoles } from "@/next-auth.d";

export const actionsDropdownItems = [
    {
        label: "Rename",
        icon: "/assets/icons/edit.svg",
        value: "rename",
    },
    {
        label: "Details",
        icon: "/assets/icons/info.svg",
        value: "details",
    },
    {
        label: "Download",
        icon: "/assets/icons/download.svg",
        value: "download",
    },
    {
        label: "Delete",
        icon: "/assets/icons/delete.svg",
        value: "delete",
    },
];

export function getFilteredDropdownItems(userRole: UserRoles) {
    return actionsDropdownItems.filter((item) => {
        // Exclude "Details" and "Download" if userRole is not "stores"
        if (userRole !== UserRoles.ROLE_MANAGER && (item.value === "rename" || item.value === "delete")) {
            return false;
        }
        return true;
    });
}

export const sortTypes = [
    {
        label: "Date created (newest)",
        value: "$createdAt-desc",
    },
    {
        label: "Created Date (oldest)",
        value: "$createdAt-asc",
    },
    {
        label: "Name (A-Z)",
        value: "name-asc",
    },
    {
        label: "Name (Z-A)",
        value: "name-desc",
    },
    {
        label: "Size (Highest)",
        value: "size-desc",
    },
    {
        label: "Size (Lowest)",
        value: "size-asc",
    },
];

export const avatarPlaceholderUrl =
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const MONTHS = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
] as const

export const WEEKS = [
    {value: "week1", label: 'Week 1'},
    {value: 'week2', label: 'Week 2'},
    {value: 'week3', label: 'Week 3'},
    {value: 'week4', label: 'Week 4'},
] as const

export const CURRENCY = [
    {value: "USD", label: 'USD'},
    {value: 'ZWL', label: 'ZWL'},
] as const

export const QUARTERS = [
    {value: "Q1", label: 'Q1'},
    {value: 'Q2', label: 'Q2'},
    {value: 'Q3', label: 'Q3'},
    {value: 'Q4', label: 'Q4'},
] as const