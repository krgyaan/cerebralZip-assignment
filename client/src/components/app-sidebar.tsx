import * as React from "react"
import { LuLayoutDashboard, LuSettings, LuUsers, LuMegaphone, LuPlugZap, LuGitBranch, LuListCheck } from "react-icons/lu"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const data = {
    navMain: [
        {
            title: "",
            url: "#",
            items: [
                {
                    title: "Setting",
                    url: "#",
                    icon: LuSettings,
                },
                {
                    title: "Team",
                    url: "#",
                    icon: LuUsers,
                },
            ],
        },
        {
            title: "MENU",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    url: "#",
                    icon: LuLayoutDashboard,
                    isActive: true,
                },
                {
                    title: "Campaigns",
                    url: "#",
                    icon: LuMegaphone,
                },
                {
                    title: "Flows",
                    url: "#",
                    icon: LuGitBranch,
                },
                {
                    title: "Integrations",
                    url: "#",
                    icon: LuPlugZap,
                },
                {
                    title: "Customers",
                    url: "#",
                    icon: LuListCheck,
                },
            ],
        }
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props} className="border-r border-border bg-slate-50">
            <SidebarHeader className="px-4 py-3">
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded">◀</span>
                    Salesway
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
                {data.navMain.map((item) => (
                    <SidebarGroup className="text-xs font-medium text-muted-foreground px-3 py-2" key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <a href={item.url} className={`flex items-center gap-3 ${item.isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}>
                                                {item.icon && <item.icon className="h-5 w-5" />}
                                                {item.title}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
            <SidebarFooter className="border-t p-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>TW</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">Tom Wang</p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
