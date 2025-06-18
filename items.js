const firebaseConfig = {
        apiKey: "AIzaSyAq1n2IIwMauj8nj7dEyPSg7wsKVID3AT8",
        authDomain: "chemical-inventory-e0681.firebaseapp.com",
        databaseURL:
          "https://chemical-inventory-e0681-default-rtdb.firebaseio.com",
        projectId: "chemical-inventory-e0681",
        storageBucket: "chemical-inventory-e0681.appspot.com",
        messagingSenderId: "1040891808880",
        appId: "1:1040891808880:web:043585c0cff38d79a338b5",
        measurementId: "G-HTH4QHPK6F",
      };

      // ✅ Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      const db = firebase.database();

      const chemicals = [
        "Asbestos Sheet",
        "B.O.D. Bottle",
        "Burette 10mL",
        "Burette",
        "Burette Stand with Clip",
        "BOD Bottle",
        "Beaker 1000mL",
        "Beaker 500mL",
        "Beaker 250mL",
        "Beaker 100mL",
        "Beaker 25mL",
        "Beaker (some)",
        "Buchner Funnel (Small)",
        "Buchner Funnel (Big)",
        "Capillary Tube",
        "Conical Flask 1000mL",
        "Conical Flask 500mL",
        "Conical Flask 250mL",
        "Conical Flask 100mL",
        "Conical Flask with Gland",
        "Conical Flask with a Glee",
        "Conical Flask Wide Side",
        "Conical Flask (Tarsm)",
        "Crucible with Lid",
        "Congo Red Paper",
        "Cotton Bleached",
        "Dessicator",
        "Drop Bottle (Glass)",
        "Conical Flask (Nominal)",
        "Column Chromatography Flask",
        "Filter Flask (500mL)",
        "Fire Bucket with Sand",
        "Evaporating Dish",
        "First Aid Box",
        "Funnel",
        "Filter Paper",
        "Funnel 100mL",
        "Filter Flask 100mL",
        "Glass Funnel (Small Sink)",
        "Glass Column",
        "Gas Pipe",
        "Glass Rod",
        "Crucible (Couch Type)",
        "ICE Spot",
        "ID Jar",
        "IL Flask",
        "Landberger’s Apparatus",
        "Iodine Flask (Glass 2500mL)",
        "Measuring Cylinder",
        "Notice Board",
        "GIRAS 500mL",
        "Ostwald Viscometer",
        "Plastic Funnel (Big)",
        "Plastic Lid",
        "Measuring Cylinder (Plastic 100mL)",
        "Measuring Cylinder 10mL",
        "Measuring Cylinder 25mL",
        "Measuring Cylinder 50mL",
        "Measuring Cylinder 100mL",
        "Pipette 25mL",
        "Pipette 100mL",
        "Plastic Sample Bottle",
        "Pestle and Mortar",
        "Plastic Funnel (Small)",
        "Plastic Beaker 500mL",
        "Plastic Beaker 1L",
        "Pipe Clay Triangle",
        "Petri Dish",
        "Plastic Beaker 2500mL",
        "Plastic Beaker 250mL",
        "Plastic Water Bath",
        "Plastic Tray",
        "Rubber Cork",
        "Reagent Bottle",
        "Spatula (Metal)",
        "Test Tube Holder",
        "Reflux Condenser",
        "Spatula (Plastic)",
        "Test Tube Stand",
        "Rubber Tubing for Burette",
        "Steel Water Bath",
        "Thiele Tube",
        "Sodium Fusion Tube",
        "Scissors",
        "TLC Jar",
        "Round Bottom Flask (2 Neck)",
        "Specific Gravity Bottle",
        "Test Tube Box",
        "Round Bottom Flask 100mL",
        "Thermometer (110°C)",
        "Stalagmometer",
        "Thermometer (300°C)",
        "Separating Funnel",
        "Separating Funnel (M/S)",
        "Test Tube Brush 6",
        "Turmeric Paper",
        "Volumetric Flask 100mL",
        "Volumetric Flask 250mL",
        "Volumetric Flask 500mL",
        "Volumetric Flask 1000mL",
        "Volumetric Flask (Plastic 1000mL)",
        "Volumetric Flask (Plastic 500mL)",
        "Volumetric Flask (Glass 100mL)",
        "Viscometer 10mL",
        "Viscometer 25mL",
        "Wire Gauze",
        "White Can (5L)",
        "Wash Bottle (500mL Plastic)",
        "Whatman Filter Paper",
        "Watch Glass",
      ];

      const inventory = document.getElementById("inventory");

      // Function to render chemicals based on a filter
      function renderChemicals(filter = "") {
        inventory.innerHTML = ""; // Clear current inventory display
        const lowerCaseFilter = filter.toLowerCase();

        chemicals.forEach((name) => {
          if (
            lowerCaseFilter === "" ||
            name.toLowerCase().includes(lowerCaseFilter)
          ) {
            const safeKey = name.replace(/[.#$/\[\]]/g, "_");

            const div = document.createElement("div");
            div.className = "container"; // Initial class
            div.setAttribute("data-chemical-name", name); // Store original name for easy lookup

            div.innerHTML = `
              <h2>${name}</h2>
              <label for="avail-${safeKey}">Available:</label>
              <div class="input-group">
                <button onclick="setAvailable('${name}')">Set</button>
                <input type="number" id="avail-${safeKey}" placeholder="Set once">
              </div>

              <label for="use-${safeKey}">Use:</label>
              <div class="input-group">
                <button onclick="useQuantity('${name}')">Use</button>
                <input type="number" id="use-${safeKey}" placeholder="Qty to use">
              </div>
              
              <p id="status-${safeKey}">Loading...</p>
            `;
            inventory.appendChild(div);

            // Fetch data from Firebase for each chemical
            db.ref("chemicals/" + safeKey).on("value", (snapshot) => {
              const data = snapshot.val();
              const availInput = document.getElementById(`avail-${safeKey}`);
              const statusParagraph = document.getElementById(
                `status-${safeKey}`
              );
              const containerDiv = availInput.closest(".container"); // Get the parent container

              if (data && data.available !== undefined) {
                const currentAvailable = data.available;
                availInput.value = currentAvailable;
                statusParagraph.innerText = `Available: ${currentAvailable}`;

                // Check for low stock and apply/remove red class
                if (currentAvailable < 12) {
                  containerDiv.classList.add("low-stock");
                  availInput.disabled = false; // Re-enable input for low stock
                } else {
                  containerDiv.classList.remove("low-stock");
                  availInput.disabled = true; // Disable if stock is sufficient
                }
              } else {
                statusParagraph.innerText = `Available: Not Set`;
                containerDiv.classList.remove("low-stock"); // Ensure no red if not set
                availInput.disabled = false; // Always enabled if not set
              }
            });
          }
        });
      }

      // Initial render of all chemicals
      renderChemicals();

      // Function to set available quantity and record timestamp
      function setAvailable(name) {
        const safeKey = name.replace(/[.#$/\[\]]/g, "_");
        const qtyInput = document.getElementById(`avail-${safeKey}`);
        const qty = parseInt(qtyInput.value);

        if (!isNaN(qty)) {
          db.ref("chemicals/" + safeKey)
            .set({
              available: qty,
              lastUpdated: firebase.database.ServerValue.TIMESTAMP, // Store server timestamp
            })
            .then(() => {
              // Success: Firebase listener will update UI
            })
            .catch((error) => {
              console.error("Error setting available quantity:", error);
            });
        } else {
          console.error(
            "Invalid quantity for setting available:",
            name,
            qtyInput.value
          );
        }
      }

      // Function to use quantity and record timestamp
      function useQuantity(name) {
        const safeKey = name.replace(/[.#$/\[\]]/g, "_");
        const useQtyInput = document.getElementById(`use-${safeKey}`);
        const useQty = parseInt(useQtyInput.value);

        if (isNaN(useQty) || useQty <= 0) {
          console.error("Invalid quantity for using:", name, useQtyInput.value);
          return; // Exit if invalid use quantity
        }

        db.ref("chemicals/" + safeKey)
          .once("value")
          .then((snapshot) => {
            const data = snapshot.val();
            if (data && data.available !== undefined) {
              const currentAvailable = data.available;
              if (currentAvailable >= useQty) {
                const newQty = currentAvailable - useQty;
                db.ref("chemicals/" + safeKey)
                  .set({
                    available: newQty,
                    lastUpdated: firebase.database.ServerValue.TIMESTAMP, // Store server timestamp
                  })
                  .then(() => {
                    useQtyInput.value = ""; // Clear use input after successful use
                  })
                  .catch((error) => {
                    console.error("Error updating quantity:", error);
                  });
              } else {
                console.warn(
                  `Not enough ${name} available. Available: ${currentAvailable}, Trying to use: ${useQty}`
                );
                // Optionally add a visual indicator to the user here (e.g., flash the status red)
              }
            } else {
              console.warn(`Available quantity for ${name} is not set.`);
            }
          })
          .catch((error) => {
            console.error("Error using quantity:", error);
          });
      }

      // Modified searchChemicals function
      function searchChemicals() {
        const searchInput = document.getElementById("searchInput").value;
        renderChemicals(searchInput); // Re-render with the search filter
      }

      // Function to navigate back (for the back button in Reports page too)
      function goBack() {
        window.history.back(); // Goes back to the previous page in history
      }

      // Function to navigate to the Reports page
      function report() {
        window.location.href = "item-report.html"; // Navigate to the new reports page
      }

      // --- Theme Toggling Logic ---
      const toggleThemeBtn = document.getElementById("toggleTheme");
      const body = document.body;
      const themeIcon = toggleThemeBtn.querySelector("i");

      // Function to apply theme
      function applyTheme(theme) {
        if (theme === "dark") {
          body.classList.add("dark-theme");
          themeIcon.classList.remove("fa-cloud-sun");
          themeIcon.classList.add("fa-moon");
        } else {
          body.classList.remove("dark-theme");
          themeIcon.classList.remove("fa-moon");
          themeIcon.classList.add("fa-cloud-sun");
        }
      }

      // Load saved theme from localStorage or default to light/system preference
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        applyTheme(savedTheme);
      } else {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          applyTheme("dark");
        } else {
          applyTheme("light"); // Default theme
        }
      }

      // Toggle theme on button click
      toggleThemeBtn.addEventListener("click", function () {
        if (body.classList.contains("dark-theme")) {
          applyTheme("light");
          localStorage.setItem("theme", "light");
        } else {
          applyTheme("dark");
          localStorage.setItem("theme", "dark");
        }
      });
