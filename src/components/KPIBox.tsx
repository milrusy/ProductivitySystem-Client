type Props = {
  title: string;
  value: string | number;
};

export const KPIBox = ({ title, value }: Props) => {
  return (
    <div style={{
      padding: "20px",
      borderRadius: "12px",
      background: "#1e1e2f",
      color: "white",
      width: "200px"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
};
