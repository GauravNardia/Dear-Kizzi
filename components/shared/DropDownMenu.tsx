"use client"
import React from 'react'
import {
    LogOut,
    MessageSquare,
  } from "lucide-react"
   
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import Image from 'next/image'
import { signOutUser } from '@/lib/actions/user.actions'
import Link from 'next/link'


const DropDownMenu = () => {

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="link">
        <Image
        src="/assets/menu.svg"
        alt="menu"
        width={30}
        height={30}
        className='dark:invert'
        />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus />
            <span>Appearance</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Computer />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub> */}
      </DropdownMenuGroup>
      <DropdownMenuItem>
        <Image src="/assets/letters.svg" width={15} height={15} alt='icon' />
        <Link href="/my-letters">My letters</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <MessageSquare />
        <Link href="/feedback">Feedback</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="text-red" onClick={() =>{signOutUser()}}>
        <LogOut />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default DropDownMenu