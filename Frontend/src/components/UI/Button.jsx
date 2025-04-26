export const Button = ({
  type,
  loading,
  onClick,
  text,
  bg,
  color,
  width,
  className,
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${color || "text-white"} ${bg || "bg-blue-600"} ${
        width ? `w-[${width}]` : "w-[100%]"
      } px-3 cursor-pointer ${
        loading ? "cursor-no-drop" : ""
      } font-semibold py-1 rounded-md h-9 flex items-center justify-center text-md ${
        className || ""
      }`}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={"22px"} color="white" />
      ) : (
        <div className="flex items-center gap-1.5">
          {icon}
          {text}
        </div>
      )}
    </button>
  );
};