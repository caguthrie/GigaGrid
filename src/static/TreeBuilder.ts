import {SubtotalRow} from "./../models/SubtotalRow";
import {SubtotalBy} from "./../models/ColumnLike";

export class TreeBuilder {

    static buildTree(data:any[], subtotalBys:SubtotalBy[], grandTotal?:SubtotalRow):Tree {
        /*
         * the way we create a Tree is as follows
         * since each detailRow in data can only belong to ONE SubtotalRow and each SubtotalRow can have only 1 parent
         * we take each detailRow, traverse from the root node (i.e. grandTotal) to the given detailRow's theoretical
         * parent SubtotalRow (in other words, find the detailRow's "bucket") and append said detailRow to the parent
         */
        grandTotal = grandTotal || new SubtotalRow("Grand Total");
        data.forEach((detailRow) => this.bucketDetailRow(subtotalBys, detailRow, grandTotal));
        return new Tree(grandTotal);
    }

    private static bucketDetailRow(subtotalBys:SubtotalBy[], detailedRow:any, grandTotal:SubtotalRow):void {
        /*
         * to traverse the grandTotal and find the detailRow's immediate parent SubtotalRow
         * we store the detailRow's sector names in an ordered array
         */
        const sectors:string[] = []; // temporary array of strings to keep track sector names in sequence
        grandTotal.detailRows.push(detailedRow);
        subtotalBys.forEach((subtotalBy) => {
            // the subtotal title
            const bucketTitle = detailedRow[subtotalBy.colTag];
            if (bucketTitle !== undefined) {
                sectors.push(bucketTitle);
                const subtotalRow = TreeBuilder.traverseOrCreate(grandTotal, sectors);
                subtotalRow.detailRows.push(detailedRow);
            }
        });
    };

    private static traverseOrCreate(grandTotal:SubtotalRow, sectors:string[]):SubtotalRow {
        // traverse to the correct SubtotalRow
        var currentRow:SubtotalRow = grandTotal;
        for (let k = 0; k < sectors.length; k++) {
            // update the current subtotal row
            if (currentRow.hasChildWithTitle(sectors[k]))
                currentRow = currentRow.getChildByTitle(sectors[k]);
            else {
                // create a new sector if it is not already available
                const newRow = new SubtotalRow(sectors[k]);
                currentRow.addChild(newRow);
                currentRow = newRow;
            }
        }
        return currentRow;
    };

}

export class Tree {

    private root:SubtotalRow;

    constructor(root:SubtotalRow) {
        this.root = root;
    }

    getRoot():SubtotalRow {
        return this.root;
    }

}