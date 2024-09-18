import tkinter as tk
from tkinter import simpledialog, messagebox
import requests
from requests.auth import HTTPBasicAuth


def get_monthly_summary():
    month = simpledialog.askstring("Zadejte měsíc", "Zadejte číslo měsíce (1-12):")

    if not month:
        return

    try:
        # Pošleme GET požadavek na API
        response = requests.get(
            f'http://ajax1.lmsoft.cz/procedure.php?cmd=getSummaryOfDrinks&month={month}',
            auth=HTTPBasicAuth('coffe', 'kafe')
        )
        data = response.json()

        drink_names = {
            "Mléko": "Mléko",
            "Espresso": "Espresso",
            "Coffe": "Coffe",
            "Long": "Long",
            "Doppio+": "Doppio+"
        }

        user_names = {
            "Masopust Lukáš": "Masopust Lukáš",
            "Molič Jan": "Molič Jan",
            "Adamek Daniel": "Adamek Daniel",
            "Weber David": "Weber David"
        }

        results_text.delete(1.0, tk.END)


        if not isinstance(data, list):
            messagebox.showerror("Chyba", "Chyba při načítání měsíčního přehledu.")
            return

        if len(data) == 0:
            results_text.insert(tk.END, "Žádné výsledky k zobrazení.\n")
        else:
            for item in data:
                drink_type = item[0]
                quantity = item[1]
                user = item[2]

                drink_name = drink_names.get(drink_type, drink_type)
                user_name = user_names.get(user, user)

                results_text.insert(tk.END, f"{user_name} vypil {quantity} {drink_name} v měsíci {month}\n")

    except requests.RequestException as e:
        messagebox.showerror("Chyba", f"Chyba při komunikaci s API: {e}")


root = tk.Tk()
root.title("Měsíční přehled")

load_button = tk.Button(root, text="Zobrazit měsíční přehled", command=get_monthly_summary)
load_button.pack(pady=10)

results_text = tk.Text(root, width=60, height=20)
results_text.pack(pady=10)

root.mainloop()
