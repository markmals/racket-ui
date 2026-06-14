import type { ReactNode } from "react";

import { getLocalTimeZone, Time, today } from "@internationalized/date";
import {
    IconBell,
    IconBold,
    IconCheck,
    IconDotsVertical,
    IconItalic,
    IconSearch,
    IconUnderline,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { ColorPicker } from "@/components/ui/color-picker";
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxTrigger,
} from "@/components/ui/combobox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { DatePicker, DatePickerContent, DatePickerTrigger } from "@/components/ui/date-picker";
import { DateRangePickerField } from "@/components/ui/date-range-picker";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { DropZone } from "@/components/ui/drop-zone";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TimeField, TimeFieldInput } from "@/components/ui/time-field";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tree, TreeItem, TreeItemContent } from "@/components/ui/tree";

export const Route = createFileRoute("/")({ component: Showcase });

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-4 border-t py-8 first:border-t-0 first:pt-0">
            <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                {title}
            </h2>
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </section>
    );
}

let chartData = [
    { month: "Jan", desktop: 186 },
    { month: "Feb", desktop: 305 },
    { month: "Mar", desktop: 237 },
    { month: "Apr", desktop: 173 },
    { month: "May", desktop: 209 },
    { month: "Jun", desktop: 264 },
];

let chartConfig = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig;

function Showcase() {
    let rangeStart = today(getLocalTimeZone());
    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Components</h1>
            <p className="text-muted-foreground">
                shadcn/ui visuals, rebuilt on React Aria Components, Tailwind v4, cva@beta, and
                Tabler Icons.
            </p>

            <Section title="Button">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button aria-label="Search" size="icon">
                    <IconSearch />
                </Button>
                <Button isDisabled>Disabled</Button>
            </Section>

            <Section title="Badge">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
            </Section>

            <Section title="Alert">
                <Alert className="max-w-md">
                    <IconBell />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        You can add components to your app using the CLI.
                    </AlertDescription>
                </Alert>
            </Section>

            <Section title="Card">
                <Card className="w-80">
                    <CardHeader>
                        <CardTitle>Create project</CardTitle>
                        <CardDescription>Deploy your new project in one click.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name of your project" />
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button>Deploy</Button>
                    </CardFooter>
                </Card>
            </Section>

            <Section title="Form controls">
                <div className="flex items-center gap-2">
                    <Checkbox aria-label="Accept terms" defaultSelected />
                    <span className="text-sm">Accept terms and conditions</span>
                </div>
                <div className="flex items-center gap-2">
                    <Switch aria-label="Airplane mode" />
                    <span className="text-sm">Airplane mode</span>
                </div>
                <RadioGroup defaultValue="comfortable">
                    <RadioGroupItem value="default">Default</RadioGroupItem>
                    <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
                    <RadioGroupItem value="compact">Compact</RadioGroupItem>
                </RadioGroup>
                <div className="grid w-full max-w-sm gap-1.5">
                    <Label htmlFor="msg">Your message</Label>
                    <Textarea id="msg" placeholder="Type your message here." />
                </div>
            </Section>

            <Section title="Select">
                <Select defaultValue="apple">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                    </SelectContent>
                </Select>
            </Section>

            <Section title="Tabs">
                <Tabs className="w-[360px]" defaultValue="account">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent className="pt-2 text-sm text-muted-foreground" value="account">
                        Make changes to your account here.
                    </TabsContent>
                    <TabsContent className="pt-2 text-sm text-muted-foreground" value="password">
                        Change your password here.
                    </TabsContent>
                </Tabs>
            </Section>

            <Section title="Overlays">
                <Dialog>
                    <DialogTrigger>
                        <Button variant="outline">Open dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-1.5">
                            <Label htmlFor="dlg-name">Name</Label>
                            <Input defaultValue="Pedro Duarte" id="dlg-name" />
                        </div>
                        <DialogFooter>
                            <DialogClose variant="outline">Cancel</DialogClose>
                            <DialogClose>
                                <IconCheck /> Save
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline">Open popover</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader>
                            <PopoverTitle>Dimensions</PopoverTitle>
                            <PopoverDescription>
                                Set the dimensions for the layer.
                            </PopoverDescription>
                        </PopoverHeader>
                    </PopoverContent>
                </Popover>

                <Tooltip>
                    <TooltipTrigger>
                        <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>Add to library</TooltipContent>
                </Tooltip>
            </Section>

            <Section title="Progress & Avatar">
                <Progress aria-label="Loading" className="w-60" value={62} />
                <Avatar>
                    <AvatarImage alt="@shadcn" src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Separator className="h-9" orientation="vertical" />
                <Avatar>
                    <AvatarFallback>RA</AvatarFallback>
                </Avatar>
            </Section>

            <Section title="Accordion">
                <Accordion className="w-full max-w-md" collapsible type="single">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It uses React Aria's Disclosure under the hood.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Does it match shadcn?</AccordionTrigger>
                        <AccordionContent>
                            Yes. The visuals are lifted from shadcn/ui.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Section>

            <Section title="Slider">
                <Slider aria-label="Volume" className="w-60" defaultValue={[50]} />
                <Slider aria-label="Range" className="w-60" defaultValue={[25, 75]} />
            </Section>

            <Section title="Toggle & Toggle Group">
                <Toggle aria-label="Bold">
                    <IconBold />
                </Toggle>
                <Toggle aria-label="Italic" variant="outline">
                    <IconItalic />
                </Toggle>
                <ToggleGroup
                    defaultSelectedKeys={["bold"]}
                    selectionMode="single"
                    variant="outline"
                >
                    <ToggleGroupItem aria-label="Bold" value="bold">
                        <IconBold />
                    </ToggleGroupItem>
                    <ToggleGroupItem aria-label="Italic" value="italic">
                        <IconItalic />
                    </ToggleGroupItem>
                    <ToggleGroupItem aria-label="Underline" value="underline">
                        <IconUnderline />
                    </ToggleGroupItem>
                </ToggleGroup>
            </Section>

            <Section title="Dropdown Menu / Sheet / Hover Card">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button aria-label="Open menu" size="icon" variant="outline">
                            <IconDotsVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Sheet>
                    <SheetTrigger>
                        <Button variant="outline">Open sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>Make changes to your profile here.</SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                <HoverCard>
                    <HoverCardTrigger>
                        <Button variant="link">@racket-ui</Button>
                    </HoverCardTrigger>
                    <HoverCardContent>shadcn/ui visuals on React Aria Components.</HoverCardContent>
                </HoverCard>
            </Section>

            <Section title="Breadcrumb">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Components</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Section>

            <Section title="Table">
                <Table className="max-w-md">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">INV001</TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">INV002</TableCell>
                            <TableCell>Pending</TableCell>
                            <TableCell className="text-right">$150.00</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Section>

            <Section title="Toast (Sonner → React Aria Toast)">
                <Button onPress={() => toast.success("Event has been created")} variant="outline">
                    Show toast
                </Button>
                <Button onPress={() => toast.error("Something went wrong")} variant="outline">
                    Error toast
                </Button>
            </Section>

            <Section title="Command (cmdk → React Aria Autocomplete)">
                <Command className="max-w-sm rounded-lg border shadow-md">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>Calendar</CommandItem>
                            <CommandItem>Search Emoji</CommandItem>
                            <CommandItem>Calculator</CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </Section>

            <Section title="Combobox">
                <Combobox>
                    <ComboboxInput placeholder="Search framework..." />
                    <ComboboxTrigger />
                    <ComboboxContent>
                        <ComboboxItem value="next">Next.js</ComboboxItem>
                        <ComboboxItem value="remix">Remix</ComboboxItem>
                        <ComboboxItem value="astro">Astro</ComboboxItem>
                        <ComboboxItem value="vite">Vite</ComboboxItem>
                    </ComboboxContent>
                </Combobox>
            </Section>

            <Section title="Input OTP (custom on React Aria)">
                <InputOTP length={6}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </Section>

            <Section title="Menubar">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>New Tab</MenubarItem>
                            <MenubarItem>New Window</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Share</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Edit</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>Undo</MenubarItem>
                            <MenubarItem>Redo</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </Section>

            <Section title="Calendar">
                <Calendar
                    aria-label="Event date"
                    className="rounded-md border p-3"
                    defaultValue={today(getLocalTimeZone())}
                />
            </Section>

            <Section title="Date / Range / Time (React Aria + @internationalized/date)">
                <DatePicker defaultValue={today(getLocalTimeZone())}>
                    <DatePickerTrigger />
                    <DatePickerContent />
                </DatePicker>
                <DateRangePickerField
                    defaultValue={{ start: rangeStart, end: rangeStart.add({ days: 7 }) }}
                    label="Booking window"
                />
                <TimeField aria-label="Appointment time" defaultValue={new Time(9, 30)}>
                    <TimeFieldInput />
                </TimeField>
            </Section>

            <Section title="Color Picker (React Aria)">
                <ColorPicker defaultValue="#6d28d9" />
                <ColorPicker defaultValue="#16a34a" />
            </Section>

            <Section title="Tree (React Aria)">
                <Tree aria-label="File tree" className="w-64 rounded-md border p-2">
                    <TreeItem id="docs" textValue="Documents">
                        <TreeItemContent>Documents</TreeItemContent>
                        <TreeItem id="readme" textValue="README">
                            <TreeItemContent>README.md</TreeItemContent>
                        </TreeItem>
                        <TreeItem id="notes" textValue="Notes">
                            <TreeItemContent>Notes.md</TreeItemContent>
                        </TreeItem>
                    </TreeItem>
                    <TreeItem id="settings" textValue="Settings">
                        <TreeItemContent>Settings</TreeItemContent>
                    </TreeItem>
                </Tree>
            </Section>

            <Section title="Drop Zone (React Aria DropZone + FileTrigger)">
                <div className="w-80">
                    <DropZone helperText="Drag & drop files here, or click to browse" />
                </div>
            </Section>

            <Section title="Alert Dialog / Drawer">
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant="outline">Delete account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Drawer>
                    {/* Drawer is vaul (Radix)-based, so its trigger uses asChild to merge
              with a custom Button — unlike the React Aria triggers. */}
                    <DrawerTrigger asChild>
                        <Button variant="outline">Open drawer</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Move goal</DrawerTitle>
                            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Section>

            <Section title="Navigation Menu">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="w-64 p-4 text-sm text-muted-foreground">
                                    Introduction, installation, and primitives.
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="#">Docs</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </Section>

            <Section title="Carousel">
                <Carousel className="mx-12 w-full max-w-xs">
                    <CarouselContent>
                        {[1, 2, 3, 4, 5].map(n => (
                            <CarouselItem key={n}>
                                <Card>
                                    <CardContent className="flex h-32 items-center justify-center p-6">
                                        <span className="text-3xl font-semibold">{n}</span>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </Section>

            <Section title="Resizable">
                <ResizablePanelGroup
                    className="h-40 max-w-md rounded-lg border"
                    orientation="horizontal"
                >
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center p-6">One</div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center p-6">Two</div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </Section>

            <Section title="Chart (recharts)">
                <ChartContainer className="h-[220px] w-full max-w-md" config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </Section>

            <Section title="Field">
                <Field className="max-w-sm">
                    <FieldLabel htmlFor="field-email">Email</FieldLabel>
                    <Input id="field-email" placeholder="you@example.com" type="email" />
                    <FieldDescription>We&apos;ll never share your email.</FieldDescription>
                </Field>
            </Section>
        </div>
    );
}
