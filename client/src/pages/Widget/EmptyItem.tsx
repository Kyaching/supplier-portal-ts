import {Input} from "@/components/ui/input";
import {useDraggable} from "@dnd-kit/core";
import {FiMaximize, FiTrash} from "react-icons/fi";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserId = {
  id: string;
};
export const EmptyItem: React.FC<UserId> = ({id}) => {
  const {attributes, listeners, setNodeRef, transform, isDragging} =
    useDraggable({
      id: id,
      data: {
        type: "empty",
      },
    });
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px,0)`,
    zIndex: 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-4/5"
    >
      {/* {isDragging ? (
        <div>
          <header className="flex items-center justify-between text-base p-2 bg-[#18b192] text-white rounded-t-sm h-6 cursor-grab">
            <span>0</span>
            <div className="flex items-center gap-1">
              <button>
                <FiMaximize />
              </button>
              <button>
                <FiTrash />
              </button>
            </div>
          </header>
          <div className="grid grid-cols-4 gap-2 bg-[#8bf1dd] p-2 rounded-b-sm">
            <div>
              <Label>First Name</Label>
              <Input className="h-6 mt-2 bg-white border-white" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input className="h-6 mt-2 bg-white border-white" />
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input className=" h-6 mt-2 bg-white border-white" />
            </div>
            <div>
              <Label>Username</Label>
              <Input className=" h-6 mt-2 bg-white border-white" />
            </div>
            <div>
              <Label>Job Title</Label>
              <Select>
                <SelectTrigger className="h-6 mt-2 bg-white border-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="l" />
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>User Type</Label>
              <Select>
                <SelectTrigger className="h-6 mt-2 bg-white border-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light" />
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tenant Id</Label>
              <Input className=" h-6 mt-2 bg-white border-white" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between text-base p-2 bg-[#18b192] text-white rounded-t-sm h-6 cursor-grab"></header>
          <div className="bg-[#8bf1dd] p-2 rounded-b-sm">
            <Input className="h-6 w-1/2 bg-white border-white" />
          </div>
        </>
      )} */}
      <>
        <header className="flex items-center justify-between text-base p-2 bg-[#18b192] text-white rounded-t-sm h-6 cursor-grab"></header>
        <div className="bg-[#8bf1dd] p-2 rounded-b-sm">
          <Input className="h-6 w-1/2 bg-white border-white" />
        </div>
      </>
    </div>
  );
};
