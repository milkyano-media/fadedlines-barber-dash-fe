import * as React from "react";
import { cn } from "@/lib/twUtils";

const Tabs = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(value || "");

  React.useEffect(() => {
    if (value !== undefined && value !== activeTab) {
      setActiveTab(value);
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
      data-state={activeTab ? "active" : "inactive"}
      data-value={activeTab}
    >
      {React.Children.map(props.children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === TabsList || child.type === TabsContent) {
          return React.cloneElement(child, {
            activeTab,
            onValueChange: handleValueChange,
          });
        }
        return child;
      })}
    </div>
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, activeTab, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  >
    {React.Children.map(props.children, (child) => {
      if (!React.isValidElement(child) || child.type !== TabsTrigger) return child;
      
      return React.cloneElement(child, {
        activeTab,
        onSelect: onValueChange,
      });
    })}
  </div>
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, activeTab, onSelect, ...props }, ref) => (
  <button
    ref={ref}
    role="tab"
    aria-selected={activeTab === value}
    data-state={activeTab === value ? "active" : "inactive"}
    onClick={() => onSelect && onSelect(value)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, activeTab, ...props }, ref) => (
  <div
    ref={ref}
    role="tabpanel"
    hidden={activeTab !== value}
    data-state={activeTab === value ? "active" : "inactive"}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
