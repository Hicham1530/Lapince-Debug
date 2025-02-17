const dashboardController = {
    overview: (req, res) => {
      res.render("dashboard/overview", { title: "Vue globale" });
    },
    expenses: (req, res) => {
      res.render("dashboard/expenses", { title: "Gestion des dépenses" });
    },
    income: (req, res) => {
      res.render("dashboard/income", { title: "Gestion des revenus" });
    },
  };
  
  export default dashboardController;